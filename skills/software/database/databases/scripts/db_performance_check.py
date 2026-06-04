#!/usr/bin/env python3
"""
Database performance analysis tool for PostgreSQL.
Analyzes slow queries, recommends indexes, and generates reports.
"""

import argparse
import json
import sys
from dataclasses import dataclass, asdict
from datetime import datetime
from typing import Dict, List, Optional

try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
    POSTGRES_AVAILABLE = True
except ImportError:
    POSTGRES_AVAILABLE = False


@dataclass
class SlowQuery:
    """Represents a slow query."""

    query: str
    execution_time_ms: float
    count: int
    collection_or_table: Optional[str] = None
    index_used: Optional[str] = None


@dataclass
class IndexRecommendation:
    """Index recommendation."""

    collection_or_table: str
    fields: List[str]
    reason: str
    estimated_benefit: str


@dataclass
class PerformanceReport:
    """Performance analysis report."""

    database_type: str
    database_name: str
    timestamp: datetime
    slow_queries: List[SlowQuery]
    index_recommendations: List[IndexRecommendation]
    database_metrics: Dict[str, any]


class PerformanceAnalyzer:
    """Analyzes PostgreSQL database performance."""

    def __init__(self, connection_string: str, threshold_ms: int = 100):
        """
        Initialize performance analyzer.

        Args:
            connection_string: PostgreSQL connection string
            threshold_ms: Slow query threshold in milliseconds
        """
        self.connection_string = connection_string
        self.threshold_ms = threshold_ms
        self.conn = None

    def connect(self) -> bool:
        """Connect to database."""
        if not POSTGRES_AVAILABLE:
            print("Error: psycopg2 not installed. Run: pip install psycopg2-binary")
            return False
        try:
            self.conn = psycopg2.connect(self.connection_string)
            return True
        except Exception as e:
            print(f"Connection error: {e}")
            return False

    def disconnect(self):
        """Disconnect from database."""
        try:
            if self.conn:
                self.conn.close()
        except Exception as e:
            print(f"Disconnect error: {e}")

    def analyze(self) -> Optional[PerformanceReport]:
        """
        Analyze database performance.

        Returns:
            PerformanceReport if successful, None otherwise
        """
        try:
            return self._analyze_postgres()
        except Exception as e:
            print(f"Analysis error: {e}")
            return None

    def _analyze_postgres(self) -> PerformanceReport:
        """Analyze PostgreSQL performance."""
        slow_queries = []
        index_recommendations = []

        with self.conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Check if pg_stat_statements extension is available
            cur.execute("""
                SELECT EXISTS (
                    SELECT 1 FROM pg_extension WHERE extname = 'pg_stat_statements'
                ) AS has_extension
            """)
            has_pg_stat_statements = cur.fetchone()["has_extension"]

            if has_pg_stat_statements:
                # Get slow queries from pg_stat_statements
                cur.execute("""
                    SELECT
                        query,
                        mean_exec_time,
                        calls,
                        total_exec_time
                    FROM pg_stat_statements
                    WHERE mean_exec_time >= %s
                    ORDER BY mean_exec_time DESC
                    LIMIT 10
                """, (self.threshold_ms,))

                for row in cur.fetchall():
                    slow_queries.append(SlowQuery(
                        query=row["query"],
                        execution_time_ms=row["mean_exec_time"],
                        count=row["calls"]
                    ))

            # Find tables with sequential scans (potential index candidates)
            cur.execute("""
                SELECT
                    schemaname,
                    tablename,
                    seq_scan,
                    seq_tup_read,
                    idx_scan
                FROM pg_stat_user_tables
                WHERE seq_scan > 1000
                    AND (idx_scan IS NULL OR seq_scan > idx_scan * 2)
                ORDER BY seq_tup_read DESC
                LIMIT 10
            """)

            for row in cur.fetchall():
                index_recommendations.append(IndexRecommendation(
                    collection_or_table=f"{row['schemaname']}.{row['tablename']}",
                    fields=["<analyze query patterns>"],
                    reason=f"High sequential scans ({row['seq_scan']}) vs index scans ({row['idx_scan'] or 0})",
                    estimated_benefit="High" if row["seq_tup_read"] > 100000 else "Medium"
                ))

            # Find unused indexes
            cur.execute("""
                SELECT
                    schemaname,
                    tablename,
                    indexname,
                    idx_scan
                FROM pg_stat_user_indexes
                WHERE idx_scan = 0
                    AND indexname NOT LIKE '%_pkey'
                ORDER BY pg_relation_size(indexrelid) DESC
            """)

            unused_indexes = []
            for row in cur.fetchall():
                unused_indexes.append(
                    f"{row['schemaname']}.{row['tablename']}.{row['indexname']}"
                )

            # Database metrics
            cur.execute("""
                SELECT
                    sum(numbackends) AS connections,
                    sum(xact_commit) AS commits,
                    sum(xact_rollback) AS rollbacks
                FROM pg_stat_database
                WHERE datname = current_database()
            """)
            stats = cur.fetchone()

            cur.execute("""
                SELECT pg_database_size(current_database()) AS db_size
            """)
            db_size = cur.fetchone()["db_size"]

            cur.execute("""
                SELECT
                    sum(heap_blks_hit) / NULLIF(sum(heap_blks_hit) + sum(heap_blks_read), 0) AS cache_hit_ratio
                FROM pg_statio_user_tables
            """)
            cache_ratio = cur.fetchone()["cache_hit_ratio"] or 0

            metrics = {
                "connections": stats["connections"],
                "commits": stats["commits"],
                "rollbacks": stats["rollbacks"],
                "database_size_mb": db_size / (1024 * 1024),
                "cache_hit_ratio": float(cache_ratio),
                "unused_indexes": unused_indexes
            }

        return PerformanceReport(
            database_type="postgres",
            database_name=self.conn.info.dbname,
            timestamp=datetime.now(),
            slow_queries=slow_queries,
            index_recommendations=index_recommendations,
            database_metrics=metrics
        )

    def print_report(self, report: PerformanceReport):
        """Print performance report."""
        print("=" * 80)
        print(f"Database Performance Report - {report.database_type.upper()}")
        print(f"Database: {report.database_name}")
        print(f"Timestamp: {report.timestamp}")
        print("=" * 80)

        print("\n## Database Metrics")
        print("-" * 80)
        for key, value in report.database_metrics.items():
            if isinstance(value, float):
                print(f"{key}: {value:.2f}")
            else:
                print(f"{key}: {value}")

        print("\n## Slow Queries")
        print("-" * 80)
        if report.slow_queries:
            for i, query in enumerate(report.slow_queries, 1):
                print(f"\n{i}. Execution Time: {query.execution_time_ms:.2f}ms | Count: {query.count}")
                if query.collection_or_table:
                    print(f"   Table: {query.collection_or_table}")
                if query.index_used:
                    print(f"   Index Used: {query.index_used}")
                print(f"   Query: {query.query[:200]}...")
        else:
            print("No slow queries found")

        print("\n## Index Recommendations")
        print("-" * 80)
        if report.index_recommendations:
            for i, rec in enumerate(report.index_recommendations, 1):
                print(f"\n{i}. {rec.collection_or_table}")
                print(f"   Fields: {', '.join(rec.fields)}")
                print(f"   Reason: {rec.reason}")
                print(f"   Estimated Benefit: {rec.estimated_benefit}")
                fields_str = ", ".join(rec.fields)
                print(f"   Command: CREATE INDEX idx_{rec.collection_or_table.replace('.', '_')}_{rec.fields[0]} ON {rec.collection_or_table}({fields_str});")
        else:
            print("No index recommendations")

        print("\n" + "=" * 80)

    def save_report(self, report: PerformanceReport, filename: str):
        """Save report to JSON file."""
        report_dict = {
            "database_type": report.database_type,
            "database_name": report.database_name,
            "timestamp": report.timestamp.isoformat(),
            "slow_queries": [asdict(q) for q in report.slow_queries],
            "index_recommendations": [asdict(r) for r in report.index_recommendations],
            "database_metrics": report.database_metrics
        }

        with open(filename, "w") as f:
            json.dump(report_dict, f, indent=2, default=str)

        print(f"\nReport saved to: {filename}")


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(description="PostgreSQL performance analysis tool")
    parser.add_argument("--uri", required=True, help="PostgreSQL connection string")
    parser.add_argument("--threshold", type=int, default=100,
                       help="Slow query threshold in milliseconds (default: 100)")
    parser.add_argument("--output", help="Save report to JSON file")

    args = parser.parse_args()

    analyzer = PerformanceAnalyzer(args.uri, args.threshold)

    if not analyzer.connect():
        sys.exit(1)

    try:
        print(f"Analyzing PostgreSQL performance (threshold: {args.threshold}ms)...")
        report = analyzer.analyze()

        if report:
            analyzer.print_report(report)

            if args.output:
                analyzer.save_report(report, args.output)

            sys.exit(0)
        else:
            print("Analysis failed")
            sys.exit(1)

    finally:
        analyzer.disconnect()


if __name__ == "__main__":
    main()

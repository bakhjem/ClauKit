<!-- Adapted from https://github.com/tanviet12/vbsec@main:skills/vbs-scan-security/references/chunking-strategy.md (MIT) -->

# Chunking Strategy (LARGE mode)

## Goal
3-10 chunks total. Each chunk = 1 logical repo section. Balanced workload.

## Primary: top-level folders
- Root-level files → "root" chunk
- Each top-level directory → 1 chunk (unless too large/small)

## Balancing rules
- >50 files in chunk → split by sub-folder
- <5 files in chunk → merge with similar-category chunk
- Language consistency > folder structure
- Test files → same chunk as their source code

## Fallback: extension clustering (flat repos)
Group all .go → one chunk, all .py → another, etc.

## Size guidelines
| Repo size | Target chunks |
|---|---|
| 30-60 files | 3-5 |
| 60-150 files | 5-8 |
| 150-300 files | 8-12 |
| Max recommended | 15 |

## Output format
List: chunk name, files[], file_count — for orchestrator to distribute to sub-agents.

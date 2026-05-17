---
name: cti-expert
description: CTI/OSINT investigation for threat actors, TTPs, timelines, forensic reconstruction
category: Security & Intelligence
status: active
---

# CTI Expert

## Purpose

Conduct cyber threat intelligence investigations using OSINT and forensic analysis. Build actor profiles, reconstruct attack timelines, map threat actor tactics/techniques/procedures (TTPs), and derive indicators of compromise. Support incident response and threat-informed defense.

## When to Use

- Investigating suspected breach or active attack to identify threat actor
- Building intelligence profiles on adversaries targeting your organization
- Reconstructing attack timeline from logs and telemetry data
- Analyzing malware or attacker infrastructure (IPs, domains, tools)
- Supporting incident response with contextual threat intelligence
- Evaluating threat actor capabilities and historical targeting patterns

**Do NOT use when**: Scanning live systems for vulnerabilities (use `vulnerability-scanner`), designing security controls (use `security`), or performing real-time threat hunting on internal systems (use SIEM + specialized tools).

## Workflow

1. **Reconnaissance & Data Collection** — Gather evidence from multiple sources: logs, alerts, forensic artifacts, public threat intel feeds, OSINT databases. Document collection timestamp and source reliability.

2. **Timeline Reconstruction** — Order events chronologically. Identify first evidence of compromise, lateral movement steps, data exfiltration points, and cleanup activities. Use precise timestamps; note timezone inconsistencies (attackers may operate across regions).

3. **Indicator Extraction** — Identify technical indicators:
   - **IPs/Domains**: C2 infrastructure, exfiltration endpoints, reconnaissance sources
   - **File Hashes**: Malware binaries, tools used
   - **Email Headers**: Spoof headers, routing paths in phishing
   - **URLs/URIs**: Phishing links, malware delivery, exploitation attempts
   - **Behavioral Patterns**: Login times, command sequences, file access patterns

4. **TTP Mapping** — Match observed behaviors to MITRE ATT&CK tactics/techniques. Example: Domain reconnaissance + credential dumping + lateral movement = Discovery + Credential Access + Lateral Movement tactics. This enables comparison against known actor profiles.

5. **Threat Actor Profiling** — Research known groups with similar TTPs:
   - **Historical targets**: Industries, geographies, asset types
   - **Motivations**: Financial crime, espionage, activism
   - **Capabilities**: Sophistication level, tool sophistication, customization
   - **Timing patterns**: Operating hours, seasonal activity
   - **Attribution confidence**: High (distinctive tools), Medium (TTP match), Low (generic tools)

6. **Intelligence Synthesis** — Produce actionable findings: Who likely attacked? What's their goal? What's their next probable move? What defenses are most critical?

## Key Concepts

### The Four Intelligence Types

Organize findings by stakeholder needs:

- **Strategic Intelligence**: Executive-level threat landscape. Example: "APT28 has increased targeting of energy sector in your region; estimated motivation is espionage to support geopolitical objectives."
- **Tactical Intelligence**: Actionable intel for immediate response. Example: "This C2 domain was registered 3 days ago and communicates with 50+ networks. Block it immediately."
- **Operational Intelligence**: Real-time attack insights. Example: "Current exploit attempts use CVE-2024-1234; patch within 48 hours."
- **Technical Intelligence**: Low-level indicators (malware signatures, IPs, domains, tool identifiers).

### MITRE ATT&CK as Intel Framework

ATT&CK organizes adversary behavior into 14 tactics (Reconnaissance → Impact) and hundreds of techniques. Use it to:
- **Classify** observed behaviors against known actor playbooks
- **Identify gaps** in defenses by mapping actor techniques to your controls
- **Predict next moves** by analyzing what techniques typically follow observed ones
- **Share intel** using standardized language across teams

### Timeline as Evidence

Attack timelines are more than chronology—they reveal:
- **Attackers' goals** (why they visited certain systems in that order)
- **Knowledge of target** (did they need reconnaissance or had insider knowledge?)
- **Tool sophistication** (did they use off-the-shelf or custom tools?)
- **Defensive blind spots** (what did we not log/monitor?)

### Confidence Levels in Attribution

Distinguish between assessment confidence and attribution certainty:
- **High Confidence**: Actor uses distinctive, custom tools or specific operational patterns
- **Medium Confidence**: TTP matches known group but requires additional supporting indicators
- **Low Confidence**: Generic tools or techniques (many groups could use same approach)

Never claim "certain attribution" based solely on TTPs; support with technical uniqueness, operational security patterns, or corroborating intelligence.

## Example

**Scenario**: Investigate suspected data exfiltration from a healthcare provider.

1. **Data Collection**: Gather firewall logs (external connections), endpoint logs (file access, process execution), DNS logs, email metadata, alert telemetry.

2. **Timeline**:
   - Day 1, 14:32 UTC: Phishing email lands (external mail gateway log)
   - Day 1, 15:11: User opens attachment (endpoint execution log shows `winrar.exe` + unknown DLL)
   - Day 2, 03:45: Lateral movement attempt to domain admin (failed logon attempts, then successful with stolen credential)
   - Day 3, 16:20: Large data transfer to external IP 203.0.113.50 (egress firewall log, 2.3 GB to port 443)
   - Day 3, 22:00: C2 communications cease, attacker cleanup (event logs cleared on compromised system)

3. **Indicators**:
   - Malware hash: `abc123def456...`
   - C2 IP: `203.0.113.50`, registered anonymously 2 weeks prior
   - Domain queried: `update-check-service.com` (typosquatting legitimate AV domain)
   - Email sender spoofing: `noreply@healthcareportal-updates.fake`

4. **TTP Mapping** (MITRE ATT&CK):
   - T1598 (Phishing) - Initial Access
   - T1204 (User Execution) - Execution
   - T1555 (Credentials from Password Stores) - Credential Access
   - T1021 (Remote Services) - Lateral Movement
   - T1020 (Exfiltration Over Alternative Protocol) - Exfiltration

5. **Threat Actor Profiling**:
   - Matches FIN7 profile: Healthcare targeting, credential-focused, spear-phishing initial access, multi-stage payload
   - Motivation: Financial (healthcare data highly valuable in underground markets)
   - Confidence: Medium (TTPs match, but no distinctive custom tooling observed)

6. **Intelligence Output**:
   - Strategic: "FIN7 likely responsible; they typically monetize data within 30 days—prioritize forensics and notification."
   - Tactical: "Block C2 IP immediately; scan all systems for malware hash; reset compromised admin credentials."
   - Operational: "Attacker still active; monitor outbound port 443 to unfamiliar destinations."

## Common Pitfalls

- **Over-attribution**: Claiming certainty on group identity with only generic TTPs; require distinctive indicators (custom tools, operational patterns, timing zones)
- **Timeline gaps**: Leaving hours/days unaccounted for; attackers hide activity in dark periods—investigate them
- **Ignoring false flags**: Attackers intentionally use competitor's tools or techniques; consider counter-intelligence
- **Static analysis**: Treating TTPs as immutable; groups evolve tools and techniques constantly
- **Tunnel vision**: Fixating on first suspect; maintain multiple hypotheses until disproven
- **Missing context**: Not understanding threat actor motivations, targets, or operational patterns leads to misalignment of priorities

## References

- [MITRE ATT&CK Framework](https://attack.mitre.org/) — Standardized taxonomy of adversary tactics and techniques based on real-world observations; essential for TTP mapping and defense planning
- [OSINT Framework](https://osintframework.com/) — Curated collection of open-source intelligence gathering tools and resources (free tools, Google Dorks, registration-required databases)
- [Recorded Future Threat Intelligence](https://www.recordedfuture.com/threat-intelligence) — Four intelligence types framework; contextualizing raw data into actionable insights for strategic, tactical, operational, and technical audiences

See also: `security` (pre-incident threat modeling), `vulnerability-scanner` (post-incident technical validation).

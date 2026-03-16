# Orchestration Protocol

#### Sequential Chaining
Chain subagents when tasks have dependencies or require outputs from previous steps:
- **Planning → Plan Review → Clear Context → Implementation → Testing → Code Review**: Use for feature development when plan approval must happen before coding
- **Research → Design → Code → Documentation**: Use for new system components
- Each agent completes fully before the next begins
- Pass context and outputs between agents in the chain

#### Plan-to-Code Handoff
When a task requires explicit plan approval before coding:
- Finish planning first and present the plan for user review
- After the user approves the plan, the user should run `/clear` to start a fresh implementation context
- Begin coding from the approved plan only after the review → clear handoff is complete
- Preserve only the minimum required handoff context: goal, approved approach, plan path, constraints, unresolved questions
- Treat `/clear` as a user-triggered context reset between planning and coding, not as an internal subagent step

#### Parallel Execution
Spawn multiple subagents simultaneously for independent tasks:
- **Code + Tests + Docs**: When implementing separate, non-conflicting components
- **Multiple Feature Branches**: Different agents working on isolated features
- **Cross-platform Development**: iOS and Android specific implementations
- **Careful Coordination**: Ensure no file conflicts or shared resource contention
- **Merge Strategy**: Plan integration points before parallel execution begins
# Custom Skill Example: LinkedIn Content Generator

```typescript
// skills/linkedin-content/skill.ts
import { Anthropic } from '@anthropic-ai/sdk';

interface LinkedInPostParams {
  topic: string;
  tone: 'thought-leadership' | 'educational' | 'personal-story';
  includeHashtags: boolean;
  targetAudience: string;
}

export async function generateLinkedInPost(params: LinkedInPostParams): Promise<string> {
  const client = new Anthropic();

  const systemPrompt = await readFile('./prompts/linkedin-system.md', 'utf-8');

  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{
      role: 'user',
      content: `
        Topic: ${params.topic}
        Tone: ${params.tone}
        Target audience: ${params.targetAudience}
        Include hashtags: ${params.includeHashtags}

        Generate an optimized LinkedIn post based on the parameters above.
      `
    }]
  });

  return message.content[0].type === 'text' ? message.content[0].text : '';
}
```

## Testing the skill

```typescript
// tests/linkedin-skill.test.ts
import { generateLinkedInPost } from '../skills/linkedin-content/skill';

describe('LinkedIn Content Generator', () => {
  test('generates post with correct tone', async () => {
    const post = await generateLinkedInPost({
      topic: 'AI in marketing',
      tone: 'thought-leadership',
      includeHashtags: true,
      targetAudience: 'Marketing managers'
    });

    expect(post).toBeDefined();
    expect(post.length).toBeGreaterThan(100);
    expect(post.length).toBeLessThan(3000); // LinkedIn limit
    expect(post).toContain('#'); // Has hashtags
  });
});
```

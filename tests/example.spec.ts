// src/lib/helpers.test.ts
import { describe, it, expect } from 'vitest';

// Assume your highlight function is in another file
function highlight(text: string, keyword: string): string {
    if (!text || !keyword) return text || '';
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

describe('highlight function', () => {
  it('should wrap the keyword with <mark> tags', () => {
    const text = 'hello world';
    const keyword = 'world';
    const result = highlight(text, keyword);
    expect(result).toBe('hello <mark>world</mark>');
  });
});
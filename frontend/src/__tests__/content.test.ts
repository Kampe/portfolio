import { describe, expect, it } from 'vitest'
import { caseStudies, expertise, experience } from '../content/portfolio'

describe('portfolio content', () => {
  it('has unique case-study routes and evidence', () => {
    expect(new Set(caseStudies.map((study) => study.slug)).size).toBe(caseStudies.length)
    for (const study of caseStudies) {
      expect(study.approach.length).toBeGreaterThanOrEqual(3)
      expect(study.outcomes.length).toBeGreaterThanOrEqual(3)
      expect(study.stack.length).toBeGreaterThanOrEqual(4)
    }
  })

  it('keeps expertise and resume intentionally scannable', () => {
    expect(expertise).toHaveLength(6)
    expect(experience.length).toBeGreaterThanOrEqual(5)
  })
})

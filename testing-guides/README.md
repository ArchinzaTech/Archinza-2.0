# Testing Guides for Archinza 2.0

Complete testing documentation covering all 18 testing types following industry standards.

## Quick Start

1. **Start Here:** [00-COMPLETE-TESTING-STRATEGY.md](./00-COMPLETE-TESTING-STRATEGY.md)
2. **Choose your testing type** from the guides below
3. **Follow the step-by-step instructions** with Archinza-specific examples

---

## All Testing Guides

### Foundation Testing (Do First)
| # | Guide | Focus | Automation | Priority | Duration |
|---|-------|-------|------------|----------|----------|
| 01 | [Unit Testing](./01-UNIT-TESTING-GUIDE.md) | Individual functions/components | 100% | Critical | Ongoing |
| 02 | [Integration Testing](./02-INTEGRATION-TESTING-GUIDE.md) | API + Database + Services | 90% | Critical | Sprint |
| 07 | [End-to-End Testing](./07-E2E-TESTING-GUIDE.md) | Complete user journeys | 70% | High | Sprint |

### Deployment Testing (Before Release)
| # | Guide | Focus | Automation | Priority | Duration |
|---|-------|-------|------------|----------|----------|
| 04 | [Smoke Testing](./04-SMOKE-TESTING-GUIDE.md) | Quick deployment validation | 100% | Critical | 5-10 min |
| 05 | [Sanity Testing](./05-SANITY-TESTING-GUIDE.md) | Specific fix verification | 80% | High | 15-30 min |
| 06 | [Regression Testing](./06-REGRESSION-TESTING-GUIDE.md) | Existing features still work | 90% | Critical | Pre-release |

### Functional Testing
| # | Guide | Focus | Automation | Priority | Duration |
|---|-------|-------|------------|----------|----------|
| 03 | [Functional Testing](./03-FUNCTIONAL-TESTING-GUIDE.md) | Business requirements | 80% | High | Sprint |
| 08 | [Acceptance Testing](./08-ACCEPTANCE-TESTING-GUIDE.md) | Stakeholder approval | 40% | High | UAT Phase |

### Performance Testing
| # | Guide | Focus | Automation | Priority | Duration |
|---|-------|-------|------------|----------|----------|
| 09 | [Performance Testing](./09-PERFORMANCE-TESTING-GUIDE.md) | Speed and efficiency | 90% | Critical | Weekly |
| 10 | [Load Testing](./10-LOAD-TESTING-GUIDE.md) | Expected user load | 100% | Critical | Pre-release |
| 11 | [Stress Testing](./11-STRESS-TESTING-GUIDE.md) | Beyond capacity | 100% | High | Monthly |
| 18 | [Single User Performance](./18-SINGLE-USER-PERFORMANCE-TESTING-GUIDE.md) | Individual UX | 80% | Medium | Sprint |

### Security & Quality
| # | Guide | Focus | Automation | Priority | Duration |
|---|-------|-------|------------|----------|----------|
| 12 | [Security Testing](./12-SECURITY-TESTING-GUIDE.md) | OWASP Top 10, vulnerabilities | 70% | Critical | Continuous |
| 13 | [Accessibility Testing](./13-ACCESSIBILITY-TESTING-GUIDE.md) | WCAG 2.1 compliance | 60% | High | Continuous |
| 16 | [Non-Functional Testing](./16-NON-FUNCTIONAL-TESTING-GUIDE.md) | Usability, reliability | 70% | High | Sprint |

### Specialized Testing
| # | Guide | Focus | Automation | Priority | Duration |
|---|-------|-------|------------|----------|----------|
| 14 | [Black Box Testing](./14-BLACK-BOX-TESTING-GUIDE.md) | External perspective | 50% | Medium | Testing phase |
| 15 | [White Box Testing](./15-WHITE-BOX-TESTING-GUIDE.md) | Code structure | 70% | High | Development |
| 17 | [Interactive Testing](./17-INTERACTIVE-TESTING-GUIDE.md) | UI interactions | 40% | Medium | Sprint |

---

## Testing Workflow

### For Developers
```
1. Write unit tests (01) alongside code
2. Run integration tests (02) locally
3. Verify changes don't break existing features (06)
4. Commit with passing tests
```

### For QA Engineers
```
1. Run smoke tests (04) after deployment
2. Execute functional tests (03) for new features
3. Perform E2E tests (07) for critical flows
4. Run regression suite (06) before release
5. Conduct acceptance testing (08) with stakeholders
```

### For DevOps
```
1. Automate smoke tests (04) in CI/CD
2. Schedule load tests (10) weekly
3. Monitor performance metrics (09)
4. Run security scans (12) continuously
```

### Before Every Release
```
1. ✅ All unit tests pass (01)
2. ✅ Integration tests pass (02)
3. ✅ Regression tests pass (06)
4. ✅ E2E critical flows pass (07)
5. ✅ Load testing shows acceptable performance (10)
6. ✅ Security scan shows no critical issues (12)
7. ✅ Accessibility audit passes (13)
8. ✅ Acceptance testing approved (08)
```

---

## Tools Required

### Testing Frameworks
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
npm install --save-dev cypress supertest
npm install --save-dev @axe-core/react
```

### Performance Tools
```bash
# k6 for load testing
brew install k6

# Lighthouse for frontend performance
npm install -g lighthouse
```

### Security Tools
```bash
npm audit
npm install -g snyk
```

---

## Quick Reference

### What test should I run?

| Situation | Run This Test |
|-----------|--------------|
| Just wrote a function | Unit Testing (01) |
| Created a new API endpoint | Integration Testing (02) |
| Completed a feature | Functional Testing (03) |
| Just deployed to staging | Smoke Testing (04) |
| Fixed a bug | Sanity Testing (05) |
| Before releasing | Regression Testing (06) |
| New user flow complete | E2E Testing (07) |
| Ready for stakeholder review | Acceptance Testing (08) |
| App feels slow | Performance Testing (09) |
| Expecting high traffic | Load Testing (10) |
| Need to find limits | Stress Testing (11) |
| Security audit needed | Security Testing (12) |
| Accessibility concerns | Accessibility Testing (13) |
| Testing as end-user | Black Box Testing (14) |
| Debugging code logic | White Box Testing (15) |
| Checking quality attributes | Non-Functional Testing (16) |
| UI not responding correctly | Interactive Testing (17) |
| Individual user complaints | Single User Performance (18) |

---

## Coverage Targets

```
Unit Tests: 80% code coverage
Integration Tests: All API endpoints
E2E Tests: All critical user journeys
Performance: < 200ms API, < 3s page load
Security: No critical vulnerabilities
Accessibility: WCAG 2.1 Level AA
```

---

## Support

For questions or issues with testing:
1. Check the specific testing guide
2. Review the master strategy (00)
3. Consult the tech stack guides in `/tech-stack-guides/`

---

## Contributing

When adding new tests:
1. Follow the patterns in existing guides
2. Update this README if adding new test types
3. Ensure tests are automated where possible
4. Document any new tools or dependencies

---

**Last Updated:** [Date]
**Total Guides:** 19 (1 master strategy + 18 testing types)
**Total Pages:** 4,742 lines of comprehensive testing documentation

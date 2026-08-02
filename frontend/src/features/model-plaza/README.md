# Model Plaza

## Responsibilities

- `data/datasources/`: public model-plaza API contract and request adapter.
- `presentation/pages/`: standalone and authenticated-layout page composition.
- `presentation/widgets/`: filtering, group summaries, and pricing tables.
- `__tests__/`: feature-level rendering and pricing regressions.

The public route is `/model-plaza`. Availability and authentication behavior are
controlled by the public settings returned by the backend; the backend remains
the authority for feature access and exclusive-group visibility.

`model_plaza_auto_public_models` is an opt-in display policy. When enabled, the
backend supplements every active non-exclusive group with platform defaults and
schedulable-account model mappings. Configured channel prices take precedence;
the global pricing catalog is only a display fallback and does not change
gateway availability or billing.

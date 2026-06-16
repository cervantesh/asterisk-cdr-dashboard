# Legacy Parity Notes

The modern report registry preserves the behavior from the original Java app:

- `call-details`: old `CallDetailsReport`, listing `src`, `dst`, `duration`, and `disposition`.
- `top-made-sources`: old `MostCallsMadeQuery`, grouped by `src`.
- `top-received-destinations`: old `MostCallsRecievedQuery`, filtered to `ANSWERED` and grouped by `dst`.
- `missed-destinations`: old `MostCallsMissedQuery`, filtered to `NO ANSWER` and `BUSY`, grouped by `dst`.

The new UI shows both `duration` and `billsec` because the legacy Hibernate and JDBC report paths used those duration fields differently.


#!/bin/bash
# Run Jest tests with optional coverage
jest --config=jest.config.js --coverage --coverageReporters=text-summary --coverageReporters=json-summary "$@"

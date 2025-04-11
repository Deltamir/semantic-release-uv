import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    reporters: ['default', 'junit'],
    outputFile: {
        junit: 'reports/junit.xml'
    },
    coverage: {
      provider: 'istanbul',
      reportsDirectory: "reports",
      reporter: ['cobertura']
    },
    setupFiles: ['tests/vitest.setup.ts']
  },
})
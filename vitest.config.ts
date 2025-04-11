import { coverageConfigDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    reporters: ['default', 'junit'],
    outputFile: {
        junit: 'report/junit.xml'
    },
    coverage: {
      provider: 'istanbul',
      reportsDirectory: "report",
      reporter: ['cobertura', 'text-summary'],
      exclude: ['**/release.config**', ...coverageConfigDefaults.exclude]
    },
    setupFiles: ['tests/vitest.setup.ts']
  },
})
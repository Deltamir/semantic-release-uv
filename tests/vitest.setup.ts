import { http, HttpResponse } from "msw";
import { afterAll, afterEach, beforeAll } from "vitest";
import { setupServer } from "msw/node";


export const restHandlers = [
  http.post("http://pypi.mockup.com", () => {
    return HttpResponse.text("OK")
  }),
  http.post("http://pypi.mockup.com/403", () => {
    return HttpResponse.json(
      {
        errorMessage: "Forbidden",
      },
      { status: 403 }
    );
  }),
  http.post("http://pypi.mockup.com/404", () => {
    return HttpResponse.json(
      {
        errorMessage: "Not Found",
      },
      { status: 404 }
    );
  }),
  http.post("https://upload.pypi.org/legacy/", (request) => {
    const autho = request.request.headers.get("authorization");
    return HttpResponse.text(autho);
  }),
];

const server = setupServer(...restHandlers);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

// Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test for test isolation
afterEach(() => server.resetHandlers());

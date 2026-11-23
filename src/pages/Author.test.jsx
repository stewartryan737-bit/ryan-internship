import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import Author from "./Author";

jest.mock("axios");
jest.mock("../components/author/AuthorItems", () => () => (
  <div>Author items</div>
));

beforeEach(() => {
  window.scrollTo = jest.fn();
  axios.get.mockReset();
});

function renderAuthor() {
  return render(
    <MemoryRouter initialEntries={["/author/1"]}>
      <Link to="/author/2">Other author</Link>
      <Routes>
        <Route path="/author/:authorId" element={<Author />} />
      </Routes>
    </MemoryRouter>
  );
}

test("shows skeletons while loading, then the author and items", async () => {
  let resolveRequest;
  axios.get.mockReturnValue(new Promise((resolve) => {
    resolveRequest = resolve;
  }));

  const { container } = renderAuthor();
  expect(axios.get).toHaveBeenCalledWith(
    "https://us-central1-nft-cloud-functions.cloudfunctions.net/authors",
    { params: { author: "1" } },
  );
  expect(screen.getByRole("status", { name: "Loading author data" })).toBeTruthy();
  expect(container.querySelectorAll(".skeleton-box").length).toBeGreaterThan(0);
  expect(screen.queryByText("Author items")).toBeNull();

  await act(async () => {
    resolveRequest({ data: { authorName: "Alice", followers: 2 } });
  });

  expect(screen.queryByRole("status")).toBeNull();
  expect(screen.getByText("Alice")).toBeTruthy();
  expect(screen.getByText("Author items")).toBeTruthy();
});

test("shows an error instead of loading forever when the request fails", async () => {
  const log = jest.spyOn(console, "error").mockImplementation(() => {});
  axios.get.mockRejectedValue(new Error("Request failed"));

  renderAuthor();

  expect((await screen.findByRole("alert")).textContent).toBe("Could not load author data.");
  expect(screen.queryByRole("status")).toBeNull();
  log.mockRestore();
});

test("reloads on author changes and ignores an older response", async () => {
  let resolveFirst;
  let resolveSecond;
  axios.get
    .mockReturnValueOnce(new Promise((resolve) => { resolveFirst = resolve; }))
    .mockReturnValueOnce(new Promise((resolve) => { resolveSecond = resolve; }));

  renderAuthor();
  fireEvent.click(screen.getByText("Other author"));
  expect(axios.get).toHaveBeenLastCalledWith(
    "https://us-central1-nft-cloud-functions.cloudfunctions.net/authors",
    { params: { author: "2" } },
  );
  expect(screen.getByRole("status")).toBeTruthy();

  await act(async () => {
    resolveSecond({ data: { authorName: "Bob", followers: 1 } });
  });
  await act(async () => {
    resolveFirst({ data: { authorName: "Alice", followers: 2 } });
  });

  expect(screen.getByText("Bob")).toBeTruthy();
  expect(screen.queryByText("Alice")).toBeNull();
});

test("shows skeletons again when navigating after an author has loaded", async () => {
  axios.get
    .mockResolvedValueOnce({ data: { authorName: "Alice", followers: 2 } })
    .mockReturnValueOnce(new Promise(() => {}));

  renderAuthor();
  expect(await screen.findByText("Alice")).toBeTruthy();

  fireEvent.click(screen.getByText("Other author"));
  expect(screen.getByRole("status")).toBeTruthy();
  expect(screen.queryByText("Alice")).toBeNull();
  expect(screen.queryByText("Author items")).toBeNull();
});

import React from "react";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import TopSellers from "./TopSellers";

jest.mock("axios");

test("shows seller skeletons until the API data loads", async () => {
  let resolveRequest;
  axios.get.mockReturnValue(new Promise((resolve) => {
    resolveRequest = resolve;
  }));

  const { container } = render(
    <MemoryRouter>
      <TopSellers />
    </MemoryRouter>
  );

  const list = container.querySelector(".author_list");
  expect(list.children).toHaveLength(12);
  expect(list.querySelectorAll("li .skeleton-box")).toHaveLength(36);
  expect(list.querySelectorAll("a")).toHaveLength(0);

  await act(async () => {
    resolveRequest({
      data: [{ name: "Seller", image: "/seller.jpg", eth: 2.1 }],
    });
  });

  expect(list.children).toHaveLength(1);
  expect(list.querySelectorAll(".skeleton-box")).toHaveLength(0);
  expect(screen.getByText("Seller").getAttribute("href")).toBe("/author");
  expect(screen.getByText("2.1 ETH")).toBeTruthy();
  expect(list.querySelector('img[src="/seller.jpg"]')).toBeTruthy();
});

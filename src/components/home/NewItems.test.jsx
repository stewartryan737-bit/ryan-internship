import React from "react";
import { act, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import NewItems from "./NewItems";

jest.mock("axios");
jest.mock("react-slick", () => ({ children }) => <div>{children}</div>);

test("renders API fields and updates countdowns until expiry", async () => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2026-01-01T00:00:00Z"));
  axios.get.mockResolvedValue({
    data: [
      {
        id: 1,
        title: "First item",
        authorImage: "/author.jpg",
        nftImage: "/nft.jpg",
        price: 5.07,
        likes: 69,
        expiryDate: Date.now() + 2000,
      },
      {
        id: 2,
        title: "No expiry",
        authorImage: "/other-author.jpg",
        nftImage: "/other-nft.jpg",
        price: 1,
        likes: 2,
        expiryDate: null,
      },
    ],
  });

  const { container, unmount } = render(
    <MemoryRouter>
      <NewItems />
    </MemoryRouter>
  );

  await act(async () => {
    await Promise.resolve();
  });

  const firstCard = screen.getByText("First item").closest(".nft__item");
  expect(within(firstCard).getByText("5.07 ETH")).toBeTruthy();
  expect(firstCard.querySelector('img[src="/author.jpg"]')).toBeTruthy();
  expect(firstCard.querySelector('img[src="/nft.jpg"]')).toBeTruthy();
  expect(within(firstCard).getByText("00h 00m 02s")).toBeTruthy();
  expect(container.querySelectorAll(".de_countdown")).toHaveLength(1);

  act(() => {
    jest.advanceTimersByTime(3000);
  });
  expect(within(firstCard).getByText("00h 00m 00s")).toBeTruthy();

  unmount();
  jest.useRealTimers();
});

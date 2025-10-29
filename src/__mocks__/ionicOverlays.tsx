// Current unused

import { vi } from "vitest";

vi.mock("@ionic/react", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, any>;

  return {
    ...actual,
    IonModal: ({ children }: any) => (
      <div data-testid="mock-ion-modal">{children}</div>
    ),
    IonPopover: ({ children }: any) => (
      <div data-testid="mock-ion-popover">{children}</div>
    ),
    IonAlert: ({ children }: any) => (
      <div data-testid="mock-ion-alert">{children}</div>
    ),
    IonActionSheet: ({ children }: any) => (
      <div data-testid="mock-ion-actionsheet">{children}</div>
    ),
  };
});

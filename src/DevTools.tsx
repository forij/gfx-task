import { useEffect, useState } from "react";

export function DevTools() {
  const [prefComponent, setPrefComponent] = useState<any>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    const importComponent = async () => {
      const { Perf } = await import("r3f-perf");
      setPrefComponent(<Perf position="top-left" />);
    };

    importComponent();
  }, []);

  return prefComponent;
}

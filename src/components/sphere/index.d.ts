import { FC } from "react";

export interface SphereProps {
  isDark: boolean;
  disableForwarding: boolean;
}

declare const Sphere: FC<SphereProps>;
export default Sphere;
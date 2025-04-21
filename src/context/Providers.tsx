import { NavbarProvider } from "./NavbarContext";
import { OrderProvider } from "./orderContext";
import { ProductProvider } from "./ProductContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <OrderProvider>
      <ProductProvider>
        <NavbarProvider>
            {children}
        </NavbarProvider>
      </ProductProvider>
    </OrderProvider>
  )
}

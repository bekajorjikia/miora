import { WelcomePage } from "@/components/WelcomePage";
import { getRestaurant } from "@/lib/menu-repository";

export const dynamic = "force-dynamic";

export default async function Home() {
  const restaurant = await getRestaurant();
  return <WelcomePage restaurant={restaurant} />;
}

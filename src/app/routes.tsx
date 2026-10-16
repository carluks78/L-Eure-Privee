import { createBrowserRouter } from "react-router";
import { Layout } from "./components";
import { Admin, AuthPage, ContactPage, DemandePage, DestinationPage, Destinations, EditorialPage, FaqPage, GuideArticle, Guides, LegalPage, NotFound, ProviderPage, SearchPage, ServiceDetail, ServicesPage, Sitemap, Splash, UniversePage } from "./pages";

export const router = createBrowserRouter([
  { path: "/", Component: Splash },
  { Component: Layout, children: [
    { path: "/services", Component: ServicesPage },
    { path: "/services/:slug", Component: UniversePage },
    { path: "/prestations/:slug", Component: ServiceDetail },
    { path: "/recherche", Component: SearchPage },
    { path: "/demande", Component: DemandePage },
    { path: "/notre-maison", element: <EditorialPage path="/notre-maison" /> },
    { path: "/notre-philosophie", element: <EditorialPage path="/notre-philosophie" /> },
    { path: "/proprietaires", element: <EditorialPage path="/proprietaires" /> },
    { path: "/sejours", element: <EditorialPage path="/sejours" /> },
    { path: "/destinations", Component: Destinations },
    { path: "/destinations/:slug", Component: DestinationPage },
    { path: "/guides", Component: Guides },
    { path: "/guides/:slug", Component: GuideArticle },
    { path: "/contact", Component: ContactPage },
    { path: "/rejoindre-notre-reseau", Component: ProviderPage },
    { path: "/faq", Component: FaqPage },
    { path: "/mentions-legales", element: <LegalPage doc="mentions" /> },
    { path: "/confidentialite", element: <LegalPage doc="confidentialite" /> },
    { path: "/cookies", element: <LegalPage doc="cookies" /> },
    { path: "/cgv", element: <LegalPage doc="cgv" /> },
    { path: "/accessibilite", element: <LegalPage doc="accessibilite" /> },
    { path: "/plan-du-site", Component: Sitemap },
    { path: "*", Component: NotFound },
  ]},
  { path: "/login", element: <AuthPage mode="login" /> },
  { path: "/register", element: <AuthPage mode="register" /> },
  { path: "/forgot-password", element: <AuthPage mode="forgot" /> },
  { path: "/reset-password", element: <AuthPage mode="reset" /> },
  { path: "/admin", Component: Admin },
]);

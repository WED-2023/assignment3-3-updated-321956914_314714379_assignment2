import Main from "../pages/MainPage.vue";
import NotFound from "../pages/NotFoundPage.vue";

const routes = [
  {
    path: "/",
    name: "main",
    component: Main,
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../pages/RegisterPage.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../pages/LoginPage.vue"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("../pages/SearchPage.vue"),
  },
  {
    path: "/recipe/me/:recipeid",
    name: "merecipe",
    component: () => import("../pages/RecipeViewPage.vue"),
  },
  {
    path: "/recipe/:recipeid",
    name: "recipe",
    component: () => import("../pages/RecipeViewPage.vue"),
  },
  {
    path: "/:catchAll(.*)",
    name: "notFound",
    component: NotFound,
  },
  {
  path: "/about",
  name: "about",
  component: () => import("../pages/AboutPage.vue"),
  },
  {
  path: "/favorites",
  name: "favorites",
  component: () => import("../pages/FavoritesPage.vue"),
},
{
  path: "/myrecipes",
  name: "myrecipes",
  component: () => import("../pages/MyRecipesPage.vue"), 
},
{
  path: "/familyrecipes",
  name: "familyrecipes",
  component: () => import("../pages/FamilyRecipesPage.vue"),
},
];

export default routes;

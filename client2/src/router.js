import Vue from 'vue';
import VueRouter from 'vue-router';
import ReadingPage from "./components/ReadingPage";
import LineGraph from "./components/ParentComponent";
import MyMobile from "./components/MyMobile";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "ReadingPage",
    component: ReadingPage,
  },
  {
    path: "/line",
    name: "ParentComponent",
    component: LineGraph,
  },
  {
    path: "/mobile",
    name: "MyMobile",
    component: MyMobile,
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
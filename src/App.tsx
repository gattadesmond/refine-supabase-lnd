import {
  Refine,
  Authenticated,
} from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  AuthPage,
  ErrorComponent,
  useNotificationProvider,
  ThemedLayout,
  ThemedSider,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";
import "./index.css";

import { dataProvider, liveProvider } from "@refinedev/supabase";
import { App as AntdApp } from "antd";
import { BrowserRouter, Route, Routes, Outlet } from "react-router";
import routerProvider, {
  NavigateToResource,
  CatchAllNavigate,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";

import {
  MembersList,
  MembersCreate,
  MembersEdit,
  MembersShow,
} from "./pages/members";
import {
  CategoriesList,
  CategoriesCreate,
  CategoriesEdit,
  CategoriesShow,
} from "./pages/categories";

import {
  EventsList,
  EventsCreate,
  EventsEdit,
  EventsShow,
} from "./pages/events";
import {
  LearningMaterialsList,
  LearningMaterialsCreate,
  LearningMaterialsEdit,
  LearningMaterialsShow,
} from "./pages/learning_materials";
import {
  StoriesList,
  StoriesCreate,
  StoriesEdit,
} from "./pages/stories";

import { AppIcon } from "./components/app-icon";
import { supabaseClient } from "./utility";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { Header } from "./components/header";
import authProvider from "./authProvider";
import { BookOpen, Users, FolderOpen, Calendar, GraduationCap } from "lucide-react";

function App() {
  return (
    <BrowserRouter>
      {/* <GitHubBanner /> */}
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider(supabaseClient)}
                liveProvider={liveProvider(supabaseClient)}
                authProvider={authProvider}
                routerProvider={routerProvider}
                notificationProvider={useNotificationProvider}
                resources={[
                  {
                    name: "stories",
                    list: "/stories",
                    create: "/stories/create",
                    edit: "/stories/edit/:id",
                    meta: {
                      label: "Stories",
                      icon: <BookOpen size={16} />,
                    },
                  }, {
                    name: "categories",
                    list: "/categories",
                    create: "/categories/create",
                    edit: "/categories/edit/:id",
                    show: "/categories/show/:id",
                    meta: {
                      label: "Categories",
                      icon: <FolderOpen size={16} />,
                      canDelete: true,
                    },
                  }, {
                    name: "members",
                    list: "/members",
                    create: "/members/create",
                    edit: "/members/edit/:id",
                    show: "/members/show/:id",
                    meta: {
                      label: "Members",
                      icon: <Users size={16} />,
                    }
                  }, {
                    name: "events",
                    list: "/events",
                    create: "/events/create",
                    edit: "/events/edit/:id",
                    show: "/events/show/:id",
                    meta: {
                      label: "Events",
                      icon: <Calendar size={16} />,
                    }
                  }, {
                    name: "learning_materials",
                    list: "/learning_materials",
                    create: "/learning_materials/create",
                    edit: "/learning_materials/edit/:id",
                    show: "/learning_materials/show/:id",
                    meta: {
                      label: "Learning Materials",
                      icon: <GraduationCap size={16} />,
                    }
                  }
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  projectId: "tXU1Am-9UF01z-5NT45A",
                  title: { text: "Refine Project", icon: <AppIcon /> },
                }}
              >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ThemedLayout
                          Header={Header}
                          Sider={(props) => <ThemedSider {...props} fixed />}
                        >
                          <div
                            style={{
                              maxWidth: "1200px",
                              marginLeft: "auto",
                              marginRight: "auto",
                            }}
                          >
                            <Outlet />
                          </div>
                        </ThemedLayout>
                      </Authenticated>
                    }
                  >
                    <Route
                      index
                      element={<NavigateToResource resource="blog_posts" />}
                    />

                    <Route path="/members">
                      <Route index element={<MembersList />} />
                      <Route path="create" element={<MembersCreate />} />
                      <Route path="edit/:id" element={<MembersEdit />} />
                      <Route path="show/:id" element={<MembersShow />} />
                    </Route>
                    <Route path="/categories">
                      <Route index element={<CategoriesList />} />
                      <Route path="create" element={<CategoriesCreate />} />
                      <Route path="edit/:id" element={<CategoriesEdit />} />
                      <Route path="show/:id" element={<CategoriesShow />} />
                    </Route>
                    <Route path="/events">
                      <Route index element={<EventsList />} />
                      <Route path="create" element={<EventsCreate />} />
                      <Route path="edit/:id" element={<EventsEdit />} />
                      <Route path="show/:id" element={<EventsShow />} />
                    </Route>
                    <Route path="/learning_materials">
                      <Route index element={<LearningMaterialsList />} />
                      <Route path="create" element={<LearningMaterialsCreate />} />
                      <Route path="edit/:id" element={<LearningMaterialsEdit />} />
                      <Route path="show/:id" element={<LearningMaterialsShow />} />
                    </Route>
                    <Route path="/stories">
                      <Route index element={<StoriesList />} />
                      <Route path="create" element={<StoriesCreate />} />
                      <Route path="edit/:id" element={<StoriesEdit />} />
                    </Route>

                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route
                      path="/login"
                      element={
                        <AuthPage
                          type="login"
                          formProps={{
                            initialValues: {
                              email: "hung.nguyen9@mservice.com.vn",
                              password: "Wolfsnow123",
                            },
                          }}
                        />
                      }
                    />
                    <Route
                      path="/register"
                      element={<AuthPage type="register" />}
                    />
                    <Route
                      path="/forgot-password"
                      element={<AuthPage type="forgotPassword" />}
                    />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;

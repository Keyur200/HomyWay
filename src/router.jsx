import React, { useContext } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthContext } from 'context/AuthProvider';
import Layout from 'containers/Layout/Layout';
import Loader from 'components/Loader/Loader';
import {
  HOME_PAGE,
  LISTING_POSTS_PAGE,
  SINGLE_POST_PAGE,
  AGENT_PROFILE_PAGE,
  AGENT_PROFILE_FAVORITE,
  AGENT_PROFILE_CONTACT,
  PRICING_PLAN_PAGE,
  PRIVACY_PAGE,
  LOGIN_PAGE,
  REGISTRATION_PAGE,
  FORGET_PASSWORD_PAGE,
  ADD_HOTEL_PAGE,
  AGENT_IMAGE_EDIT_PAGE,
  AGENT_PASSWORD_CHANGE_PAGE,
  AGENT_ACCOUNT_SETTINGS_PAGE,
} from './settings/constant';
import DemoListing from './containers/AddListing/DemoListing';
import Listing from './components/Listing/Listing';

// protected route
function RequireAuth({ children }) {
  let { loggedIn } = useContext(AuthContext);
  let location = useLocation();
  if (!loggedIn) {
    return <Navigate to={LOGIN_PAGE} state={{ from: location }} />;
  }

  return children;
}

// public routes
const HomePage = React.lazy(() => import('containers/Home/Home'));
const ListingPage = React.lazy(() => import('containers/Listing/Listing'));
const SinglePageView = React.lazy(
  () => import('containers/SinglePage/SinglePageView'),
);
const AgentDetailsViewPage = React.lazy(
  () => import('containers/Agent/AccountDetails/AgentDetailsViewPage'),
);
const AgentItemLists = React.lazy(
  () => import('containers/Agent/AccountDetails/AgentItemLists'),
);
const AgentFavItemLists = React.lazy(
  () => import('containers/Agent/AccountDetails/AgentFavItemLists'),
);
const AgentContact = React.lazy(
  () => import('containers/Agent/AccountDetails/AgentContact'),
);
const PricingPage = React.lazy(() => import('containers/Pricing/Pricing'));
const PrivacyPage = React.lazy(() => import('containers/Privacy/Privacy'));
const SignInPage = React.lazy(() => import('containers/Auth/SignIn/SignIn'));
const SignUpPage = React.lazy(() => import('containers/Auth/SignUp/SignUp'));
const ForgetPasswordPage = React.lazy(
  () => import('containers/Auth/ForgetPassword'),
);
const NotFound = React.lazy(() => import('containers/404/404'));
// protected route
const AddListingPage = React.lazy(
  () => import('containers/AddListing/AddListing'),
);
const AgentAccountSettingsPage = React.lazy(
  () => import('containers/Agent/AccountSettings/AgentAccountSettingsPage'),
);
const AgentCreateOrUpdateForm = React.lazy(
  () => import('containers/Agent/AccountSettings/AgentCreateOrUpdateForm'),
);
const AgentPictureChangeForm = React.lazy(
  () => import('containers/Agent/AccountSettings/AgentPictureChangeForm'),
);
const ChangePassWord = React.lazy(
  () => import('containers/Agent/AccountSettings/ChangePassWordForm'),
);

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={HOME_PAGE} element={<Layout />}>
        <Route
          index
          element={
            <React.Suspense fallback={<Loader />}>
              <HomePage />
            </React.Suspense>
          }
        />
        <Route
          path={LISTING_POSTS_PAGE}
          element={
            <React.Suspense fallback={<Loader />}>
              <Listing />
            </React.Suspense>
          }
        />
        {/* <Route
          path={`${SINGLE_POST_PAGE}/:slug`}
          element={
            <React.Suspense fallback={<Loader />}>
              <SinglePageView />
            </React.Suspense>
          }
        /> */}
        {/* Nested routes for agent page */}
        <Route
          path={AGENT_PROFILE_PAGE}
          element={
            <React.Suspense fallback={<Loader />}>
              <AgentDetailsViewPage />
            </React.Suspense>
          }
        >
          <Route
            path={AGENT_PROFILE_PAGE}
            element={
              <React.Suspense fallback={<Loader />}>
                <AgentItemLists />
              </React.Suspense>
            }
          />
          <Route
            path={AGENT_PROFILE_FAVORITE}
            element={
              <React.Suspense fallback={<Loader />}>
                <AgentFavItemLists />
              </React.Suspense>
            }
          />
          <Route
            path={AGENT_PROFILE_CONTACT}
            element={
              <React.Suspense fallback={<Loader />}>
                <AgentContact />
              </React.Suspense>
            }
          />
        </Route>
        {/* end of Nested routes */}
        <Route
          path={PRICING_PLAN_PAGE}
          element={
            <React.Suspense fallback={<Loader />}>
              <PricingPage />
            </React.Suspense>
          }
        />
        <Route
          path={PRIVACY_PAGE}
          element={
            <React.Suspense fallback={<Loader />}>
              <PrivacyPage />
            </React.Suspense>
          }
        />
        <Route
          path={LOGIN_PAGE}
          element={
            <React.Suspense fallback={<Loader />}>
              <SignInPage />
            </React.Suspense>
          }
        />
        <Route
          path={REGISTRATION_PAGE}
          element={
            <React.Suspense fallback={<Loader />}>
              <SignUpPage />
            </React.Suspense>
          }
        />
        <Route
          path={FORGET_PASSWORD_PAGE}
          element={
            <React.Suspense fallback={<Loader />}>
              <ForgetPasswordPage />
            </React.Suspense>
          }
        />
        {/* Protected routes */}
        <Route
          path={ADD_HOTEL_PAGE}
          element={
            <React.Suspense fallback={<Loader />}>
              <RequireAuth>
                <AddListingPage />
              </RequireAuth>
            </React.Suspense>
          }
        />
        <Route
          path={"add"}
          element={
            <React.Suspense fallback={<Loader />}>
              {/* <RequireAuth> */}
              <DemoListing />
              {/* </RequireAuth> */}
            </React.Suspense>
          }
        />

        <Route
          path={"PropertyDetails/:id"}
          element={
            <React.Suspense fallback={<Loader />}>
              {/* <RequireAuth> */}
              <SinglePageView/>
              {/* </RequireAuth> */}
            </React.Suspense>
          }
        />
        <Route
          path={AGENT_ACCOUNT_SETTINGS_PAGE}
          element={
            <React.Suspense fallback={<Loader />}>
              <RequireAuth>
                <AgentAccountSettingsPage />
              </RequireAuth>
            </React.Suspense>
          }
        >
          <Route
            path={AGENT_ACCOUNT_SETTINGS_PAGE}
            element={
              <React.Suspense fallback={<Loader />}>
                <AgentCreateOrUpdateForm />
              </React.Suspense>
            }
          />
          <Route
            path={AGENT_IMAGE_EDIT_PAGE}
            element={
              <React.Suspense fallback={<Loader />}>
                <AgentPictureChangeForm />
              </React.Suspense>
            }
          />
          <Route
            path={AGENT_PASSWORD_CHANGE_PAGE}
            element={
              <React.Suspense fallback={<Loader />}>
                <ChangePassWord />
              </React.Suspense>
            }
          />
        </Route>
        {/* end of Protected routes*/}
        <Route
          path="*"
          element={
            <React.Suspense fallback={<Loader />}>
              <NotFound />
            </React.Suspense>
          }
        />
      </Route>
    </Routes>
  );
}

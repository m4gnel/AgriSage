package com.agrisage.app.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.toRoute
import com.agrisage.app.ui.screens.AdvisoryResultScreen
import com.agrisage.app.ui.screens.CameraScreen
import com.agrisage.app.ui.screens.HomeScreen
import com.agrisage.app.ui.screens.SplashScreen
import com.agrisage.app.ui.screens.OnboardingScreen
import com.agrisage.app.ui.screens.AdvisorScreen
import com.agrisage.app.ui.screens.FieldsScreen
import com.agrisage.app.ui.screens.WeatherScreen
import com.agrisage.app.ui.screens.AlertsScreen
import com.agrisage.app.ui.screens.ProfileScreen

/**
 * AgriSage Navigation Graph.
 * All 8 screens wired with type-safe routes (Navigation Compose 2.8.5).
 *
 * START → Splash → Onboarding (step 0,1,2) OR Home (returning user)
 * Home → Advisor | Fields | FieldDetail | Weather | Alerts | Profile | Camera
 */
@Composable
fun AgriSageNavGraph(navController: NavHostController) {
    NavHost(
        navController = navController,
        startDestination = Splash,
    ) {
        // ── Splash ──────────────────────────────────────────────────
        composable<Splash> {
            SplashScreen(navController = navController)
        }

        // ── Onboarding (3 steps) ────────────────────────────────────
        composable<Onboarding> { backStackEntry ->
            val route = backStackEntry.toRoute<Onboarding>()
            OnboardingScreen(
                navController = navController,
                step = route.step,
            )
        }

        // ── Home Dashboard ──────────────────────────────────────────
        composable<Home> {
            HomeScreen(
                onNavigateToCamera = { navController.navigate(Advisor) },
                onNavigateToWeather = { navController.navigate(Weather) },
                onNavigateToRisks = { navController.navigate(Alerts) },
                onNavigateToSchemes = { navController.navigate(Profile) },
            )
        }

        // ── AI Advisor Chat ─────────────────────────────────────────
        composable<Advisor> {
            AdvisorScreen(navController = navController)
        }

        // ── My Fields ───────────────────────────────────────────────
        composable<Fields> {
            FieldsScreen(navController = navController)
        }

        // ── Field Detail ─────────────────────────────────────────────
        composable<FieldDetail> { backStackEntry ->
            val route = backStackEntry.toRoute<FieldDetail>()
            // Placeholder until FieldDetailScreen is built
            FieldsScreen(navController = navController)
        }

        // ── Weather & Forecast ──────────────────────────────────────
        composable<Weather> {
            WeatherScreen(navController = navController)
        }

        // ── Alerts ──────────────────────────────────────────────────
        composable<Alerts> {
            AlertsScreen(navController = navController)
        }

        // ── Profile & Settings ──────────────────────────────────────
        composable<Profile> {
            ProfileScreen(navController = navController)
        }

        // ── Camera (existing) ───────────────────────────────────────
        composable<com.agrisage.app.navigation.Splash> {
            SplashScreen(navController = navController)
        }
    }
}

package com.agrisage.app.ui.components

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import com.agrisage.app.ui.theme.SageDeep
import com.agrisage.app.ui.theme.SageMid

sealed class BottomNavItem(
    val route: String,
    val title: String,
    val icon: ImageVector
) {
    object Home : BottomNavItem("home", "Home", Icons.Default.Home)
    object Advisor : BottomNavItem("advisor", "AI Chat", Icons.Default.Chat)
    object Fields : BottomNavItem("fields", "My Fields", Icons.Default.Grass)
    object Weather : BottomNavItem("weather", "Weather", Icons.Default.WbSunny)
    object Alerts : BottomNavItem("alerts", "Alerts", Icons.Default.Notifications)
}

/**
 * Reusable AgriSage Bottom Navigation Bar featuring active state styling,
 * SageDeep color palette, and high accessibility contrast per master spec.
 */
@Composable
fun AgriBottomNav(
    currentRoute: String?,
    onNavigate: (String) -> Unit
) {
    val items = listOf(
        BottomNavItem.Home,
        BottomNavItem.Advisor,
        BottomNavItem.Fields,
        BottomNavItem.Weather,
        BottomNavItem.Alerts
    )

    NavigationBar(
        containerColor = Color.White,
        contentColor = SageDeep
    ) {
        items.forEach { item ->
            val isSelected = currentRoute == item.route
            NavigationBarItem(
                icon = {
                    Icon(
                        imageVector = item.icon,
                        contentDescription = item.title,
                        tint = if (isSelected) SageDeep else Color.Gray
                    )
                },
                label = {
                    Text(
                        text = item.title,
                        fontSize = 11.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                        color = if (isSelected) SageDeep else Color.Gray
                    )
                },
                selected = isSelected,
                onClick = {
                    if (currentRoute != item.route) {
                        onNavigate(item.route)
                    }
                },
                colors = NavigationBarItemDefaults.colors(
                    indicatorColor = SageMid.copy(alpha = 0.2f)
                )
            )
        }
    )
}

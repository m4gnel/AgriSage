package com.agrisage.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import com.agrisage.app.ui.theme.*

/**
 * Screen 6: Weather & Forecast
 * Route: Weather
 *
 * Per spec:
 * - Current conditions card (SageDeep bg)
 * - 7-day forecast row (horizontal scroll)
 * - AI Advisory banner
 * - Farming conditions (Spray | Irrigation | Field work) cards
 */

data class DayForecast(
    val dayName: String,
    val condition: String,
    val highC: Float,
    val lowC: Float,
    val isToday: Boolean = false
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WeatherScreen(navController: NavController) {
    // Demo data — replace with WeatherViewModel.forecast StateFlow
    val forecast = listOf(
        DayForecast("Today", "☀️", 33f, 24f, isToday = true),
        DayForecast("Tue", "⛅", 31f, 23f),
        DayForecast("Wed", "🌧️", 27f, 21f),
        DayForecast("Thu", "🌧️", 26f, 20f),
        DayForecast("Fri", "⛅", 29f, 22f),
        DayForecast("Sat", "☀️", 32f, 23f),
        DayForecast("Sun", "☀️", 34f, 25f),
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("🌤️ Weather & Forecast", color = Color.White) },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
                    }
                },
                actions = {
                    IconButton(onClick = { /* TODO: refresh */ }) {
                        Icon(Icons.Default.Refresh, contentDescription = "Refresh", tint = Color.White)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color(0xFF1B4332))
            )
        }
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(Color(0xFFF8FCF8)),
            contentPadding = PaddingValues(bottom = 24.dp)
        ) {
            // ── Current Conditions Card ───────────────────────────────────
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(
                            Brush.verticalGradient(
                                colors = listOf(Color(0xFF1B4332), Color(0xFF2D6A4F))
                            )
                        )
                        .padding(24.dp)
                ) {
                    Column {
                        Row(
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Default.LocationOn, null, tint = Color.White.copy(alpha = 0.7f), modifier = Modifier.size(14.dp))
                            Spacer(Modifier.width(4.dp))
                            Text(
                                text = "Ernakulam, Kerala",  // TODO: from DataStore/ViewModel
                                fontSize = 12.sp,
                                color = Color.White.copy(alpha = 0.7f)
                            )
                        }
                        Spacer(Modifier.height(8.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(
                                    text = "28°C",
                                    fontSize = 56.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.White
                                )
                                Text(
                                    text = "Partly Cloudy — Good for field work",
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = Color.White.copy(alpha = 0.8f)
                                )
                            }
                            Text("⛅", fontSize = 48.sp)
                        }
                        Spacer(Modifier.height(16.dp))
                        // Stats row
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            WeatherStatChip("💧 78%", "Humidity")
                            WeatherStatChip("💨 12km/h", "Wind")
                            WeatherStatChip("🌧️ 2mm", "Rain")
                            WeatherStatChip("☀️ UV 5", "UV Index")
                        }
                    }
                }
            }

            // ── 7-Day Forecast ─────────────────────────────────────────────
            item {
                Column(modifier = Modifier.padding(horizontal = 16.dp).padding(top = 16.dp)) {
                    Text(
                        "7-Day Forecast",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold,
                        color = Color(0xFF1B4332)
                    )
                    Spacer(Modifier.height(8.dp))
                    LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        items(forecast) { day ->
                            ForecastDayCard(day)
                        }
                    }
                }
            }

            // ── AI Advisory Banner ─────────────────────────────────────────
            item {
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 16.dp),
                    color = Color(0xFFE8F4E8),
                    shape = RoundedCornerShape(16.dp),
                    shadowElevation = 2.dp
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "🤖 Agri-SAGE Advisory",
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF1B4332),
                            fontSize = 14.sp
                        )
                        Spacer(Modifier.height(8.dp))
                        Text(
                            text = "Rain expected Wednesday–Thursday. Delay chemical spraying to Saturday. " +
                                    "Ideal fertiliser window: today before 9 AM.",
                            style = MaterialTheme.typography.bodyMedium,
                            color = Color(0xFF2D6A4F)
                        )
                    }
                }
            }

            // ── Farming Conditions ─────────────────────────────────────────
            item {
                Column(modifier = Modifier.padding(horizontal = 16.dp)) {
                    Text(
                        "Farming Conditions Today",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold,
                        color = Color(0xFF1B4332)
                    )
                    Spacer(Modifier.height(8.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        FarmingConditionCard("🌿", "Spray", "Good", "Low humidity & wind", Modifier.weight(1f))
                        FarmingConditionCard("💧", "Irrigation", "Fair", "2mm rain today", Modifier.weight(1f))
                        FarmingConditionCard("🚜", "Field Work", "Good", "Dry conditions", Modifier.weight(1f))
                    }
                }
            }
        }
    }
}

@Composable
private fun WeatherStatChip(value: String, label: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(value, fontSize = 12.sp, color = Color.White, fontWeight = FontWeight.Medium)
        Text(label, fontSize = 10.sp, color = Color.White.copy(alpha = 0.6f))
    }
}

@Composable
private fun ForecastDayCard(day: DayForecast) {
    Surface(
        shape = RoundedCornerShape(12.dp),
        color = if (day.isToday) Color(0xFF1B4332) else Color.White,
        shadowElevation = 2.dp,
        modifier = Modifier
            .width(72.dp)
            .then(
                if (day.isToday)
                    Modifier.background(Color(0xFF1B4332), RoundedCornerShape(12.dp))
                else Modifier
            )
    ) {
        Column(
            modifier = Modifier.padding(10.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                day.dayName,
                fontSize = 11.sp,
                fontWeight = FontWeight.Medium,
                color = if (day.isToday) Color.White else Color(0xFF6B7280)
            )
            Spacer(Modifier.height(6.dp))
            Text(day.condition, fontSize = 22.sp)
            Spacer(Modifier.height(6.dp))
            Text(
                "${day.highC.toInt()}°",
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = if (day.isToday) Color.White else Color(0xFF1B4332)
            )
            Text(
                "${day.lowC.toInt()}°",
                fontSize = 11.sp,
                color = if (day.isToday) Color.White.copy(alpha = 0.7f) else Color(0xFF9CA3AF)
            )
        }
    }
}

@Composable
private fun FarmingConditionCard(
    icon: String,
    label: String,
    status: String,
    reason: String,
    modifier: Modifier = Modifier
) {
    val statusColor = when (status) {
        "Good" -> Color(0xFF16A34A)
        "Fair" -> Color(0xFFF59E0B)
        else -> Color(0xFFDC2626)
    }
    Surface(
        shape = RoundedCornerShape(12.dp),
        color = Color.White,
        shadowElevation = 2.dp,
        modifier = modifier
    ) {
        Column(
            modifier = Modifier.padding(10.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(icon, fontSize = 20.sp)
            Spacer(Modifier.height(4.dp))
            Text(label, fontSize = 11.sp, color = Color(0xFF6B7280))
            Text(status, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = statusColor)
            Text(reason, fontSize = 10.sp, color = Color(0xFF9CA3AF))
        }
    }
}

@Preview(showBackground = true, widthDp = 360, heightDp = 800)
@Composable
fun WeatherScreenPreview() {
    WeatherScreen(navController = rememberNavController())
}

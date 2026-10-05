package com.agrisage.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import com.agrisage.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    viewModel: HomeViewModel,
    onNavigateToCamera: () -> Unit,
    onNavigateToWeather: () -> Unit,
    onNavigateToRisks: () -> Unit,
    onNavigateToSchemes: () -> Unit
) {
    val connectivity by viewModel.connectivityStatus.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("My Rice Farm", color = Color.White) },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = ColorPrimaryDark),
                actions = {
                    IconButton(onClick = { }) {
                        Icon(Icons.Default.Refresh, contentDescription = "Sync", tint = Color.White)
                    }
                    IconButton(onClick = { }) {
                        Icon(Icons.Default.Notifications, contentDescription = "Alerts", tint = Color.White)
                    }
                }
            )
        },
        bottomBar = {
            NavigationBar(containerColor = Color.White) {
                NavigationBarItem(selected = true, onClick = { }, icon = { Icon(Icons.Default.Home, null) }, label = { Text("Home") })
                NavigationBarItem(selected = false, onClick = { }, icon = { Icon(Icons.Default.Place, null) }, label = { Text("Farm") })
                NavigationBarItem(
                    selected = false,
                    onClick = onNavigateToCamera,
                    icon = {
                        Box(
                            modifier = Modifier
                                .size(48.dp)
                                .background(ColorPrimary, CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.CameraAlt, null, tint = Color.White)
                        }
                    },
                    label = { Text("Diagnose") }
                )
                NavigationBarItem(selected = false, onClick = { }, icon = { Icon(Icons.Default.Warning, null) }, label = { Text("Alerts") })
                NavigationBarItem(selected = false, onClick = { }, icon = { Icon(Icons.Default.Person, null) }, label = { Text("Profile") })
            }
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            // AlertBanner shown ONLY when NOT connected
            if (connectivity != ConnectivityStatus.ONLINE) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(if (connectivity == ConnectivityStatus.OFFLINE) ColorOfflineBanner else ColorWarningBg)
                        .padding(12.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = if (connectivity == ConnectivityStatus.OFFLINE) Icons.Default.CloudOff else Icons.Default.Warning,
                            contentDescription = null,
                            tint = if (connectivity == ConnectivityStatus.OFFLINE) ColorOfflineText else ColorWarningText
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = if (connectivity == ConnectivityStatus.OFFLINE) "ഇന്റർനെറ്റ് ഇല്ല — സേവ് ചെയ്ത ഡേറ്റ" else "Limited connection",
                            style = MaterialTheme.typography.bodyMedium,
                            color = if (connectivity == ConnectivityStatus.OFFLINE) ColorOfflineText else ColorWarningText
                        )
                    }
                }
            }

            // Morning Briefing Card
            Spacer(modifier = Modifier.height(16.dp))
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp)
                    .background(ColorPrimaryLight, RoundedCornerShape(16.dp))
                    .padding(16.dp)
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Rice • Tillering (Day 42)", style = MaterialTheme.typography.headlineSmall, color = ColorPrimaryDark)
                        IconButton(onClick = { }) {
                            Icon(Icons.Default.VolumeUp, contentDescription = "TTS Read")
                        }
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("Risk: High disease vulnerability due to high humidity", style = MaterialTheme.typography.bodyMedium)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("Recommended Action: Inspect lower leaves for blast spots before 5 PM today.", style = MaterialTheme.typography.bodyLarge)
                }
            }

            // 2x2 ActionTile Grid
            Spacer(modifier = Modifier.height(24.dp))
            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                modifier = Modifier.padding(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                item { ActionTile("Check Crop", Icons.Default.PhotoCamera, ColorPrimary, onNavigateToCamera) }
                item { ActionTile("Farm Weather", Icons.Default.WbCloudy, ColorSecondary, onNavigateToWeather) }
                item { ActionTile("View Risks", Icons.Default.Warning, ColorRiskMedium, onNavigateToRisks) }
                item { ActionTile("My Schemes", Icons.Default.AccountBalance, ColorSchemeText, onNavigateToSchemes) }
            }
        }
    }
}

@Composable
fun ActionTile(label: String, icon: ImageVector, iconColor: Color, onClick: () -> Unit) {
    Surface(
        onClick = onClick,
        shape = RoundedCornerShape(12.dp),
        shadowElevation = 2.dp,
        color = Color.White,
        modifier = Modifier
            .fillMaxWidth()
            .height(100.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(icon, contentDescription = null, tint = iconColor, modifier = Modifier.size(32.dp))
            Spacer(modifier = Modifier.height(8.dp))
            Text(label, style = MaterialTheme.typography.labelLarge)
        }
    }
}

package com.agrisage.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import com.agrisage.app.navigation.FieldDetail

/**
 * Screen 5: My Fields
 * Route: Fields
 *
 * Per spec:
 * - List of registered fields/farms with area, crop, health badge (NDVI-based)
 * - Add field FAB
 * - Field card: Name | Crop | Area | Health badge | Last observation | View detail →
 * - Empty state: "Add your first field 🌱"
 */

data class FieldSummary(
    val id: String,
    val name: String,
    val crop: String,
    val areaAcres: Float,
    val healthLabel: String,  // Excellent | Good | Fair | Poor
    val ndvi: Float,
    val lastObservation: String,
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FieldsScreen(navController: NavController) {
    // Demo data — replace with FieldsViewModel StateFlow
    val fields = listOf(
        FieldSummary("1", "North Paddy Field", "Rice", 2.5f, "Good", 0.62f, "2 days ago"),
        FieldSummary("2", "Coconut Grove", "Coconut", 1.2f, "Excellent", 0.78f, "5 days ago"),
        FieldSummary("3", "Tapioca Plot", "Tapioca", 0.8f, "Fair", 0.41f, "Yesterday"),
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("🌿 My Fields", color = Color.White) },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color(0xFF1B4332))
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { /* TODO: Navigate to AddFieldScreen */ },
                containerColor = Color(0xFF2D6A4F)
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Field", tint = Color.White)
            }
        }
    ) { innerPadding ->
        if (fields.isEmpty()) {
            // Empty state
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("🌱", fontSize = 56.sp)
                    Spacer(Modifier.height(12.dp))
                    Text(
                        "Add your first field",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF1B4332)
                    )
                    Text(
                        "Tap the + button to register your farm",
                        style = MaterialTheme.typography.bodyMedium,
                        color = Color(0xFF6B7280)
                    )
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .background(Color(0xFFF8FCF8)),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Summary row
                item {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        StatChip("${fields.size}", "Fields")
                        StatChip("${fields.sumOf { it.areaAcres.toDouble() }.let { "%.1f".format(it) }}ac", "Total Area")
                        StatChip("${fields.count { it.healthLabel != "Poor" }}", "Healthy")
                    }
                }

                items(fields.size) { i ->
                    FieldCard(
                        field = fields[i],
                        onClick = { navController.navigate(FieldDetail(fieldId = fields[i].id)) }
                    )
                }
            }
        }
    }
}

@Composable
private fun StatChip(value: String, label: String) {
    Surface(
        shape = RoundedCornerShape(12.dp),
        color = Color(0xFF1B4332)
    ) {
        Column(
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(value, fontWeight = FontWeight.Bold, color = Color.White, fontSize = 18.sp)
            Text(label, color = Color.White.copy(alpha = 0.7f), fontSize = 11.sp)
        }
    }
}

@Composable
private fun FieldCard(field: FieldSummary, onClick: () -> Unit) {
    val healthColor = when (field.healthLabel) {
        "Excellent" -> Color(0xFF16A34A)
        "Good" -> Color(0xFF2D6A4F)
        "Fair" -> Color(0xFFF59E0B)
        else -> Color(0xFFDC2626)
    }

    Surface(
        onClick = onClick,
        shape = RoundedCornerShape(16.dp),
        color = Color.White,
        shadowElevation = 3.dp,
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    field.name,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF1B4332),
                    fontSize = 16.sp
                )
                Box(
                    modifier = Modifier
                        .background(healthColor.copy(alpha = 0.15f), RoundedCornerShape(8.dp))
                        .padding(horizontal = 10.dp, vertical = 4.dp)
                ) {
                    Text(
                        "● ${field.healthLabel}",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = healthColor
                    )
                }
            }

            Spacer(Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                FieldInfoChip("🌾", field.crop)
                FieldInfoChip("📐", "${field.areaAcres} ac")
                FieldInfoChip("🛰️", "NDVI ${field.ndvi}")
            }

            Spacer(Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    "Last observation: ${field.lastObservation}",
                    fontSize = 12.sp,
                    color = Color(0xFF9CA3AF)
                )
                Text(
                    "View detail →",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFF2D6A4F)
                )
            }
        }
    }
}

@Composable
private fun FieldInfoChip(icon: String, text: String) {
    Row {
        Text(icon, fontSize = 13.sp)
        Spacer(Modifier.width(4.dp))
        Text(text, fontSize = 12.sp, color = Color(0xFF374151))
    }
}

@Preview(showBackground = true, widthDp = 360, heightDp = 800)
@Composable
fun FieldsScreenPreview() {
    FieldsScreen(navController = rememberNavController())
}

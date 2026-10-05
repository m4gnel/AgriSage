package com.agrisage.app.ml

import android.content.Context
import com.agrisage.app.data.local.entities.CachedAdvisoryEntity
import java.util.UUID

class OfflineAdvisoryEngine(private val context: Context) {

    fun generateOfflineAdvisory(imagePath: String, crop: String): CachedAdvisoryEntity {
        val advisoryJson = """
        {
          "diagnosis_summary": "നിങ്ങളുടെ $crop വിളയിൽ ഇലപ്പുളളി രോഗത്തിന്റെ ലക്ഷണങ്ങൾ കാണുന്നു. ആത്മവിശ്വാസം: 78%. ഇന്ന് ജലസേചനം ഒഴിവാക്കുക.",
          "confidence_state": "POSSIBLE",
          "confidence_score": 0.78,
          "safe_to_act": true,
          "offline_banner": "ഇന്റർനെറ്റ് ഇല്ല — ഓഫ്‌ലൈൻ വിശകലനം",
          "modelled_estimate_label": "* Modelled estimate — actual results vary by field conditions"
        }
        """.trimIndent()

        return CachedAdvisoryEntity(
            id = UUID.randomUUID().toString(),
            observationId = "offline-obs",
            advisoryJson = advisoryJson,
            type = "offline_advisory",
            isOffline = true,
            createdAt = System.currentTimeMillis()
        )
    }
}

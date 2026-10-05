package com.agrisage.app.di

import android.content.Context
import androidx.room.Room
import com.agrisage.app.data.local.AgriSAGEDatabase
import com.agrisage.app.data.local.dao.*
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): AgriSAGEDatabase {
        return Room.databaseBuilder(
            context,
            AgriSAGEDatabase::class.java,
            "agrisage_db"
        ).fallbackToDestructiveMigration().build()
    }

    @Provides
    fun provideFarmerDao(db: AgriSAGEDatabase): FarmerDao = db.farmerDao()

    @Provides
    fun provideFarmDao(db: AgriSAGEDatabase): FarmDao = db.farmDao()

    @Provides
    fun provideCachedAdvisoryDao(db: AgriSAGEDatabase): CachedAdvisoryDao = db.cachedAdvisoryDao()

    @Provides
    fun provideSyncQueueDao(db: AgriSAGEDatabase): SyncQueueDao = db.syncQueueDao()
}

package de.fpietzko

import com.fasterxml.jackson.databind.ObjectMapper
import io.quarkus.runtime.StartupEvent
import java.io.File
import java.nio.file.Files
import java.nio.file.Paths
import javax.enterprise.context.ApplicationScoped
import javax.enterprise.event.Observes
import kotlin.io.path.isRegularFile

@ApplicationScoped
class TestingDataInitializer(private val magicalBeastRepository: MagicalBeastRepository) {

    fun insertTestData(@Observes ev: StartupEvent) {
        val beastsDir = javaClass.classLoader.getResource("beasts")!!
        val files = Files.walk(Paths.get(beastsDir.toURI())).filter { it.isRegularFile() }.map { it.toFile() }
        files.forEach {
            val beast = parseJson(it)
            magicalBeastRepository.save(beast)
        }
    }
}

fun parseJson(file: File): MagicalBeast {
    val mapper = ObjectMapper()
    return mapper.readValue(file, MagicalBeast::class.java)
}
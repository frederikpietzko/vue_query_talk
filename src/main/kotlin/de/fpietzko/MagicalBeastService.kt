package de.fpietzko

import javax.enterprise.context.ApplicationScoped

@ApplicationScoped
class MagicalBeastService(
    private val magicalBeastRepository: MagicalBeastRepository
) {
    fun createBeast(
        name: String,
        description: String,
        longDescription: String,
        image: String
    ): MagicalBeast {
        val beast = MagicalBeast().apply {
            this.name = name
            this.description = description
            this.image = image
            this.longDescription = longDescription
        }
        return magicalBeastRepository.save(beast)
    }

    fun deleteBeast(id: Long) {
        magicalBeastRepository.deleteById(id)
    }
}
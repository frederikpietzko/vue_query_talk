package de.fpietzko

import org.springframework.data.repository.CrudRepository
import javax.transaction.Transactional
import javax.ws.rs.*


@Transactional
@Path("/beasts")
class MagicalBeastResource(
    private val magicalBeastRepository: MagicalBeastRepository,
    private val magicalBeastService: MagicalBeastService
) {
    @GET
    fun getAllBeasts(): List<MagicalBeastDto> {
        return magicalBeastRepository.findAll().map { it.toDto() }
    }

    @GET
    @Path("/{id}")
    fun getBeastById(@PathParam("id") id: Long): MagicalBeastDto {
        return magicalBeastRepository.findByIdOrNull(id)?.toDto() ?: throw NotFoundException()
    }

    @POST
    fun createBeast(request: CreateMagicalBeastRequestDto): MagicalBeastDto {
        val beast = magicalBeastService.createBeast(
            name = request.name,
            description = request.description,
            longDescription = request.longDescription,
            image = request.image
        )
        return beast.toDto()
    }

    @DELETE
    @Path("/{id}")
    fun deleteBeast(@PathParam("id") id: Long) {
        magicalBeastService.deleteBeast(id)
    }
}


data class MagicalBeastDto(
    val id: Long,
    val name: String,
    val description: String,
    val longDescription: String,
    val image: String
)

data class CreateMagicalBeastRequestDto(
    val name: String,
    val description: String,
    val longDescription: String,
    val image: String
)

fun MagicalBeast.toDto(): MagicalBeastDto {
    return MagicalBeastDto(
        id!!, name, description, longDescription, image
    )
}

fun <T, ID> CrudRepository<T, ID>.findByIdOrNull(id: ID): T? = findById(id).orElse(null)

class NotFoundException : Exception("Resource not found!")

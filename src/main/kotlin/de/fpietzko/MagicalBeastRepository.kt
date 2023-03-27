package de.fpietzko

import org.springframework.data.repository.CrudRepository

interface MagicalBeastRepository : CrudRepository<MagicalBeast, Long> {
}
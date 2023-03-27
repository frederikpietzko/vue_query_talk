package de.fpietzko

import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.Lob


@Entity
class MagicalBeast {
    @get:GeneratedValue
    @get:Id
    var id: Long? = null

    @get:Lob
    lateinit var name: String

    @get:Lob
    lateinit var image: String

    @get:Lob
    lateinit var description: String

    @get:Lob
    lateinit var longDescription: String
}
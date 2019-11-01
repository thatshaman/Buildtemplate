/**
 * @author that_shaman
 */

class Buildtemplate {

    profession = 1;
    specializations = [
        {
            id: 0,
            traits: [0, 0, 0]
        },
        {
            id: 0,
            traits: [0, 0, 0]
        },
        {
            id: 0,
            traits: [0, 0, 0]
        }
    ];

    skills = {
        terrestrial: {
            heal: 0,
            utilities: [0, 0, 0],
            elite: 0
        },
        aquatic: {
            heal: 0,
            utilities: [0, 0, 0],
            elite: 0
        }
    };

    specific = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    constructor(code) {
        if (code !== undefined) {
            this.parse(code);
        }
    }

    parse(code) {

        let chatCodeRegex = /\[&((?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?)\]/;
        let match = code.match(chatCodeRegex);

        if (match !== null && match.length === 2) {
            let byteString = atob(match[1]);
            let bytes = new Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                bytes[i] = byteString.charCodeAt(i);
            }


            // Check for correct length and header
            if (bytes.length > 0 && bytes[0] !== 0x0D) {
                throw "Wrong header type";
            } else if (bytes.length >= 44) {

                // Profession found at byte 1
                this.profession = bytes[1];

                // Specializations pairs, bytes 2 to 8
                for (let s = 0; s < 3; s++) {

                    let offset = s * 2;

                    // Specialization ID
                    this.specializations[s].id = bytes[offset + 2];
                    for (let t = 0; t < 3; t++) {
                        // 2 bit trait values
                        this.specializations[s].traits[t] = bytes[offset + 3] >> t * 2 & 0x03;
                    }
                }

                // Healing skill bytes 8 to 11
                this.skills.terrestrial.heal = bytes[8] + (bytes[9] << 8);
                this.skills.aquatic.heal = bytes[10] + (bytes[11] << 8);

                // Utility skills bytes 12 to 23
                for (let u = 0; u < 3; u++) {

                    let offset = u * 4 + 12;

                    this.skills.terrestrial.utilities[u] = bytes[offset] + (bytes[offset + 1] << 8);
                    this.skills.aquatic.utilities[u] = bytes[offset + 2] + (bytes[offset + 3] << 8);
                }

                // Elite skills bytes 24 to 27
                this.skills.terrestrial.elite = bytes[24] + (bytes[25] << 8);
                this.skills.aquatic.elite = bytes[26] + (bytes[27] << 8);

                // Profession specific bytes
                this.specific = bytes.slice(28);

            } else {
                throw "Invalid build template";
            }
        } else {
            throw "Invalid format";
        }
    }

    toString() {

        // Header
        var retval = [0x0d];

        // Profession ID
        retval.push(this.profession);

        // Specializations
        for (let s = 0; s < 3; s++) {
            retval.push(this.specializations[s].id);
            retval.push(this.specializations[s].traits[2] << 4 | this.specializations[s].traits[1] << 2 | this.specializations[s].traits[0]);
        }

        // Heal
        retval.push(this.skills.terrestrial.heal & 0xff, this.skills.terrestrial.heal >> 8 & 0xff);
        retval.push(this.skills.aquatic.heal & 0xff, this.skills.aquatic.heal >> 8 & 0xff);

        // Utility
        for (let u = 0; u < 3; u++) {
            retval.push(this.skills.terrestrial.utilities[u] & 0xff, this.skills.terrestrial.utilities[u] >> 8 & 0xff);
            retval.push(this.skills.aquatic.utilities[u] & 0xff, this.skills.aquatic.utilities[u] >> 8 & 0xff);
        }

        // Elite
        retval.push(this.skills.terrestrial.elite & 0xff, this.skills.terrestrial.elite >> 8 & 0xff);
        retval.push(this.skills.aquatic.elite & 0xff, this.skills.aquatic.elite >> 8 & 0xff);

        // Profession specific
        for (let i = 0; i < this.specific.length; i++) {
            retval.push(this.specific[i]);
        }

        // Return Base64 chat code
        return "[&" + btoa(String.fromCharCode.apply(null, retval)) + "]";
    }
}
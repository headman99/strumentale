async function strumentimusicali(item) {
    // If the free shipment label is found, true
    try {
        const freeShipmentLabel = await item.$("td:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1)")
        return true
    } catch {
        return false;
    }
}

async function mercatinomusicale(item) {
    // If the free shipment label is found, true
    try {
        const freeShipmentLabel = await item.$('img[src="/img/btn_spedizionegratuita.gif"]')
        return true
    } catch {
        return false;
    }
}

async function reverb(item) {
    // If the free shipment label is found, true
    try {
        const freeShipmentLabel = await item.$('div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > div:nth-child(1) > div:nth-child(3)')
        return true
    } catch {
        return false;
    }
}

async function ebay(item) {

    let freeShipment = false

    // If the free shipment label is found, true
    try {
        const freeShipmentLabel = await item.$eval('.s-item__shipping.s-item__logisticsCost', el => {
            return el.innerText;
        });
        if (freeShipmentLabel == 'Spedizione gratis') {
            freeShipment = true
        }
    } catch {
        // Error if there is the special green label
        try {
            const freeShipmentLabel = await item.$('.s-item__dynamic.s-item__freeXDays').getText()
            freeShipment = true
        } catch {
            // Altro errore, skip
        }
    }

    return freeShipment
}

async function piazzostrumenti(item) {
    // If the free shipment label is found, true
    try {
        const freeShipmentLabel = await item.$('.spedgrat')
        return true
    } catch {
        return false;
    }
}

async function cittadellamusica(item) {
    // For this website the shipping is usually free
    try {
        const freeShipment = true
        return freeShipment
    } catch {
        return false;
    }
}

module.exports = {
    strumentimusicali,
    mercatinomusicale,
    reverb,
    ebay,
    piazzostrumenti,
    cittadellamusica
}

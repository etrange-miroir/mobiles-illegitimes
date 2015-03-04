# mobile

## Config XBees

- Modem firmware version: ```10EC```
- Modem type: ```XB24```

Le réseau Xbee ```ATID``` est ```1```

Chaque Xbee a son adresse ```ATMY``` correspondant au numéro du meuble. Le Xbee de la régie a son ```ATMY``` à ```5```. 

Le mode de communication est le mode API: ```ATAP2```

### Configurer un XBee

```
+++ // attendre le OK
ATRE     // reset de la config du Xbee
ATID1    // ID du réseau XBee
ATMY[X]  // où [X] est l'ID du meuble (de 1 à 4), ou 5 pour la régie
ATAP2    // mode API
ATWR     // sauvegarde la conf
ATCN     // quitte le mode conf
```

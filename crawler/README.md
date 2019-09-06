Update stations

```
docker-compose run --rm crawler node src/listStations.js
```

Update weathers and temperatures

```
docker-compose run --rm crawler node src/getStations.js
```

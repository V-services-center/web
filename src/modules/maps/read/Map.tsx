import * as React from 'react';
import { Map, TileLayer } from 'react-leaflet';
import { useToggle } from 'react-angler';
import { LeafletMouseEvent } from 'leaflet';
import { Query } from 'react-apollo';

import CreatePinModal from '../create/pin';
import { mapQuery } from '../_queries';
import PinMarker from './Pin';

interface MapProps {
  lat?: number;
  lon?: number;
  mapId?: string;
  zoom?: number;
}

interface Location {
  latitude: number;
  longitude: number;
}

interface Pin {
  id: string;
  name: string;
  data: object;
  comment: string;
  location: Location;
}

interface MapData {
  data: {
    map: {
      id: string;
      name: string;
      initialArea: Location;
      pins: [Pin]
    }
  }
}

class MapQuery extends Query<MapData, { id?: string }> {}

const WorldPinsMap: React.SFC<MapProps> = ({
  lat = 50.85045, lon = 4.34878, mapId, zoom = 13,
}) => {
  const { 0: coordinates, 1: setCoordinates } = React.useState({});
  const { value: isCreating, setTrue, setFalse } = useToggle(false);
  const handleClick = React.useCallback((e: LeafletMouseEvent) => {
    setCoordinates(e.latlng);
    setTrue();
  }, [setCoordinates]);
  return (
    <MapQuery skip={!mapId} query={mapQuery} variables={{ id: mapId }}>
      {({ loading, data }) => (
        <React.Fragment>
          <Map
            animate
            center={{ lat, lng: lon }}
            onClick={handleClick}
            zoom={zoom}
          >
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {!loading && data && (data as any).map && (data as any).map.pins &&
              (data as any).map.pins.map(({ comment, id, name, location, data }: Pin) => (
                <PinMarker key={id} data={data} name={name} id={id} location={location} comment={comment} />
              ))
            }
          </Map>
          {isCreating && mapId &&
            <CreatePinModal coordinates={coordinates} mapId={mapId} onClose={setFalse} />}
        </React.Fragment>
      )}
    </MapQuery>
  )
}

export default WorldPinsMap;

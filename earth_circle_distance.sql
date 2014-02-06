DROP FUNCTION IF EXISTS earth_circle_distance;
DELIMITER $$
CREATE FUNCTION earth_circle_distance(point1 point, point2 point) RETURNS double
    DETERMINISTIC
begin
  declare lon1, lon2 double;
  declare lat1, lat2 double;
  declare td double;
  declare d_lat double;
  declare d_lon double;
  declare a, c, R double;

  set lon1 = X(GeomFromText(AsText(point1)));
  set lon2 = X(GeomFromText(AsText(point2)));
  set lat1 = Y(GeomFromText(AsText(point1)));
  set lat2 = Y(GeomFromText(AsText(point2)));

  set d_lat = radians(lat2 - lat1);
  set d_lon = radians(lon2 - lon1);

  set lat1 = radians(lat1);
  set lat2 = radians(lat2);

  set R = 6372.8; -- in kilometers

  set a = sin(d_lat / 2.0) * sin(d_lat / 2.0) + sin(d_lon / 2.0) * sin(d_lon / 2.0) * cos(\
lat1) * cos(lat2);
  set c = asin(sqrt(a));

  return R * c;
end
$$
DELIMITER ;

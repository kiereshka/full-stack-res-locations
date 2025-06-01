namespace kiereshka.Models;

public class LocationData
{
    public double X { get; set; }
    public double Y { get; set; }
    public required List<int> Costs { get; set; }
    public required List<int> Capacities { get; set; }
}
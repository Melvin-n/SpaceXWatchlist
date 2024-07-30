namespace SpaceXLaunches.Models
{
    public class Launch
    {
        public Launch()
        {
            ID = string.Empty;
            Name = string.Empty;

        }
        public string ID { get; set; }
        public string Name { get; set; }
        public string? LaunchTime { get; set; }
        public string? Success { get; set; }
        public string? Details { get; set; }
        public string? Webcast { get; set; }

    }
}

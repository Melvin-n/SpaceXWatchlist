using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SpaceXLaunches.Models;

namespace SpaceXLaunches.Data
{
    public class SpaceXLaunchesContext : DbContext
    {
        public SpaceXLaunchesContext (DbContextOptions<SpaceXLaunchesContext> options)
            : base(options)
        {
        }

        public DbSet<SpaceXLaunches.Models.Launch> Launch { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Launch>().ToTable("Launch");
        }
    }
}

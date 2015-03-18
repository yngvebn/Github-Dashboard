using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ConsoleApplication1.RacecardService;

namespace ConsoleApplication1
{
    class Program
    {
        static void Main(string[] args)
        {
            var svc = new RacecardServiceEJB();
            var result = svc.getRacecard(DateTime.Now);
        }
    }
}

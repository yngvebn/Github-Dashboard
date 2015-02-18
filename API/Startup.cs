using System.Net.Sockets;
using System.Web.Http;
using Api;
using Microsoft.Owin;
using Microsoft.Owin.Cors;
using Microsoft.Owin.Extensions;
using Microsoft.Owin.FileSystems;
using Microsoft.Owin.StaticFiles;
using Owin;

[assembly: OwinStartup(typeof(Startup))]
namespace Api
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var httpConfiguration = new HttpConfiguration();

            // Configure Web API Routes:
            // - Enable Attribute Mapping
            // - Enable Default routes at /api.
            httpConfiguration.MapHttpAttributeRoutes();
            httpConfiguration.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
            app.UseCors(CorsOptions.AllowAll);

            app.UseWebApi(httpConfiguration);

            app.Map("", spa =>
            {
                spa.Use((context, next) =>
                {
                    if (context.Request.Path.Value.Contains("."))
                    {
                        context.Request.Path = new PathString("/public"+context.Request.Path.Value);   
                    }
                    else { 
                        context.Request.Path = new PathString("/public/index.html");
                    }

                    return next();
                });

                spa.UseStaticFiles();
            });




            app.UseStageMarker(PipelineStage.MapHandler);
        }
    }
}

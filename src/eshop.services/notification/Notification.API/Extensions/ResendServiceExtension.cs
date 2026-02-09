using Notification.API.Options;
using Notification.API.Services;

namespace Notification.API.Extensions;

public static class ResendServiceExtension
{
    public static IServiceCollection AddResendEmail(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<ResendOptions>()
            .Bind(configuration.GetSection(ResendOptions.SectionName))
            .Validate(options => !string.IsNullOrWhiteSpace(options.ApiKey), "Resend ApiKey is required.")
            .ValidateOnStart();

        services.AddHttpClient<IEmailSender, ResendEmailSender>(client =>
        {
            client.BaseAddress = new Uri("https://api.resend.com/");
        });

        return services;
    }
}

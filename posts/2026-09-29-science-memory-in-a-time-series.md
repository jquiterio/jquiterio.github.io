---
title: "Memory in a time series: the autoregressive model"
summary: "The AR model is the simplest way to say that today depends on yesterday. What its parameter means, when it is stable, how it forecasts, and where the normal assumption quietly matters."
---

Many series remember their past. Interest rates, temperatures, network latency and inflation do not jump to an independent new value each period; they drift from where they were. The autoregressive model is the simplest way to write that down, and it remains the reference point for almost everything more elaborate.

## The first-order model

The AR(1) model says that each observation is a fraction of the previous one plus a new shock:

$$
X_t = c + \phi\, X_{t-1} + e_t ,
$$

where the shocks $e_t$ are independent with mean zero and variance $\sigma^2$. The single parameter $\phi$ carries the memory of the process.

If $|\phi| < 1$ the process is **stationary**: shocks fade and the series fluctuates around a fixed mean. Its main properties follow directly:

| Quantity | Value |
|---|---|
| Mean | $\mu = c / (1-\phi)$ |
| Variance | $\sigma^2 / (1-\phi^2)$ |
| Autocorrelation at lag $k$ | $\rho_k = \phi^{k}$ |

The autocorrelation gives a useful interpretation. A shock loses half its effect after $\ln 0.5 / \ln|\phi|$ periods. With $\phi = 0.9$ that is about 6.6 periods; with $\phi = 0.5$ it is one period. At $\phi = 1$ shocks never fade and the process becomes a random walk, which needs different tools altogether.

## More lags

The AR($p$) model lets the present depend on $p$ past values:

$$
X_t = c + \phi_1 X_{t-1} + \phi_2 X_{t-2} + \dots + \phi_p X_{t-p} + e_t .
$$

It is stationary when all roots of $1 - \phi_1 z - \dots - \phi_p z^p$ lie outside the unit circle. Choosing $p$ is usually done with two diagnostics: the partial autocorrelation function, which for an AR($p$) process cuts off after lag $p$, and an information criterion such as AIC.

## Forecasting

For AR(1), the forecast $h$ steps ahead pulls the last observation back towards the mean at the rate set by $\phi$:

$$
\hat{X}_{t+h} = \mu + \phi^{h}\,(x_t - \mu) ,
\qquad
\operatorname{Var}\!\left(X_{t+h} - \hat{X}_{t+h}\right) = \sigma^2\,\frac{1-\phi^{2h}}{1-\phi^{2}} .
$$

As the horizon grows, the forecast approaches the mean and its uncertainty approaches the unconditional variance. The model has nothing left to say beyond what the long-run average already tells you.

In R the whole cycle takes four lines:

```r
set.seed(1)
x   <- arima.sim(model = list(ar = 0.8), n = 500)   # simulate AR(1), phi = 0.8
fit <- arima(x, order = c(1, 0, 0))                  # estimate phi and the mean
fit$coef
predict(fit, n.ahead = 5)                            # forecasts and standard errors
```

## Where the normal assumption matters

The point forecast above does not depend on the distribution of the shocks: it only uses their mean. That makes it tempting to ignore the error distribution. Three things depend on it all the same.

- **Prediction intervals.** A 95% interval of $\hat{X} \pm 1.96$ standard errors assumes normal shocks. With heavy-tailed shocks, the true coverage in the tails is wrong, and it is wrong exactly where risk is measured.
- **Efficiency.** Least squares is the maximum likelihood estimator only under normal errors. With heavier tails, a likelihood built on the right error distribution estimates $\phi$ more precisely.
- **Risk measures.** Value at risk and expected shortfall are statements about the tails of the forecast distribution, not about its centre.

This is why my doctoral work replaces the normal shocks with the γ-order generalized normal distribution, whose shape parameter is estimated from the data. The [introduction to the γGN](#/2026-09-29-math-beyond-the-bell-curve) explains the family; the AR(1) model is where it is tested first.

## Further reading

<ol class="refs">
  <li>G. E. P. Box, G. M. Jenkins, G. C. Reinsel and G. M. Ljung, <em>Time Series Analysis: Forecasting and Control</em>, 5th ed., Wiley, 2015.</li>
  <li>R. J. Hyndman and G. Athanasopoulos, <em>Forecasting: Principles and Practice</em>, 3rd ed., OTexts, 2021. <a href="https://otexts.com/fpp3/">otexts.com/fpp3</a></li>
</ol>

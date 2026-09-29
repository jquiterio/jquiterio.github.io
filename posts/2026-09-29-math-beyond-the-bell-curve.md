---
title: "Beyond the bell curve: the γ-order generalized normal"
summary: "One extra parameter lets a model's errors be lighter- or heavier-tailed than the normal. Where the γGN comes from, how it behaves, and why it matters for time series."
---

Most statistical models assume, somewhere, that errors are normal. The assumption is convenient. The normal is described by two parameters, sums of independent normal variables are normal again, and under normal errors least squares and maximum likelihood give the same answer.

It is also often wrong. Daily returns of equity indices and exchange rates have heavier tails than the normal allows: large moves happen far more often than a Gaussian model predicts. Measurement noise from physical sensors can go the other way, with tails lighter than the normal.

A natural response is to replace the normal with a family that contains it as a special case and adds one parameter for shape. The γ-order generalized normal distribution, written γGN, is such a family. What sets it apart is where the extra parameter comes from.

## Where it comes from

The γGN was introduced by Kitsos and Tavoularis in 2009, originally under the name *hyper normal*. It arises from a generalized form of the Logarithmic Sobolev Inequality, a result that links entropy with Fisher's information. In the classical inequality the normal distribution is the case of equality. In the generalized, γ-order version, the γGN family is.

So the shape parameter is not added for flexibility alone. It comes from the information measure itself, which is why the family carries over naturally to information-theoretic tools such as entropy and the Kullback–Leibler divergence.

## The density

For location $\mu$, scale $\sigma > 0$ and shape $\gamma$, the univariate density is

$$
f(x) = \frac{C_\gamma}{\sigma}\,\exp\left\{-\frac{\gamma-1}{\gamma}\left|\frac{x-\mu}{\sigma}\right|^{\gamma/(\gamma-1)}\right\},
\qquad
C_\gamma = \frac{\left(\frac{\gamma-1}{\gamma}\right)^{(\gamma-1)/\gamma}}{2\,\Gamma\!\left(\frac{\gamma-1}{\gamma}+1\right)} .
$$

Everything depends on the exponent $\gamma/(\gamma-1)$ applied to the standardised distance from the centre:

- At $\gamma = 2$ the exponent is 2 and the density is the **normal**.
- As $\gamma \to 1^{+}$ the exponent grows without bound and the density flattens into the **uniform** on $[\mu-\sigma,\ \mu+\sigma]$.
- As $\gamma \to \infty$ the exponent falls to 1 and the density becomes the **Laplace** distribution, with heavier tails than the normal.

Values of $\gamma$ between 1 and 2 therefore give lighter tails than the normal, and values above 2 give heavier ones. The figure below lets you move through the family. Switch to the log scale to see the tails, where the differences matter most.

<div data-gn="full" data-start="3" data-title="Explore the γGN family" data-note="Solid line: γGN with location 0 and scale 1. Dashed line: standard normal. The last readout compares the probability of an observation more than three standard deviations from the centre with the same probability under the normal (0.27%)."></div>

Two numbers summarise the shape. The excess kurtosis runs from −1.2 at the uniform end, through 0 at the normal, to +3 at the Laplace end. The three-standard-deviation tail probability, which is 0.27% for the normal, is zero for the uniform limit and about 1.4% for the Laplace, roughly five times the normal value.

## Why it matters for time series

Take the first-order autoregressive model

$$
X_t = \phi\, X_{t-1} + e_t ,
$$

where each observation depends on the one before. The classical model takes the errors $e_t$ to be independent and normal. If instead the errors follow a γGN with scale $\sigma$ and shape $\gamma$, the conditional log-likelihood of a series $x_1, \dots, x_n$ is

$$
\ell(\phi, \sigma, \gamma) = \sum_{t=2}^{n} \log f\!\left(x_t - \phi\, x_{t-1};\ 0, \sigma, \gamma\right).
$$

There is no closed-form solution, so the parameters are estimated numerically. That is expected. The more interesting problems are structural:

- **Dependence.** Maximum likelihood for the γGN has been worked out for independent samples. In an AR model the observations are dependent, so the estimators and their Fisher information have to be derived again.
- **The normal is special.** An AR process is a weighted sum of its past errors. Weighted sums of independent normal errors stay normal, which is part of why the Gaussian AR model is so tractable. For γ ≠ 2 this no longer holds in general, and the distribution of the series has to be studied on its own terms.
- **How far from normal?** Once γ is estimated, distances such as Kullback–Leibler or Hellinger measure how far the fitted error law sits from the normal, and whether the difference is large enough to change a forecast or a risk estimate.

This is the subject of my doctoral work: estimate γ from the data instead of fixing it at 2, starting with the AR(1) model, testing the method by simulation and on financial series, and always checking that the classical results are recovered at γ = 2.

## Further reading

<ol class="refs">
  <li>C. P. Kitsos and N. K. Tavoularis, “Logarithmic Sobolev inequalities for information measures,” <em>IEEE Transactions on Information Theory</em>, 55(6), 2554–2561, 2009.</li>
  <li>C. P. Kitsos, V. G. Vassiliadis and T. L. Toulias, “MLE for the γ-order generalized normal distribution,” <em>Discussiones Mathematicae Probability and Statistics</em>, 34(1–2), 143–158, 2014.</li>
  <li>C. P. Kitsos and T. L. Toulias, “Hellinger distance between generalized normal distributions,” <em>British Journal of Mathematics &amp; Computer Science</em>, 21(2), 1–16, 2017.</li>
  <li>C. P. Kitsos and I. S. Stamatiou, “On the emerged from LSI γ-order generalized normal distribution,” <em>Journal of the Indian Society for Probability and Statistics</em>, 2025. <a href="https://doi.org/10.1007/s41096-025-00241-z">doi:10.1007/s41096-025-00241-z</a></li>
  <li>C. P. Kitsos, U. E. Nyamsi and I. S. Stamatiou, “Extending entropic value at risk using the γ-order generalized normal distribution,” <em>Stats</em>, 9(3), 55, 2026.</li>
</ol>

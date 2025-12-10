// src/utils/VectorUtils.ts
import type { Vector3 } from "@minecraft/server";

/**
 * Lightweight Vector3 wrapper + utility helpers for Minecraft scripting.
 *
 * You can use it in two ways:
 * - As instances: new VectorUtils(1, 2, 3).add({ x: 1, y: 0, z: 0 }).toVector3()
 * - As statics: VectorUtils.add(a, b), VectorUtils.center(points), etc.
 */
export class VectorUtils {
  public x: number;
  public y: number;
  public z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  // ──────────────────────────────────────────────────────────
  // Constructors / Conversions
  // ──────────────────────────────────────────────────────────

  static from(vec: Vector3): VectorUtils {
    return new VectorUtils(vec.x, vec.y, vec.z);
  }

  static fromTuple([x, y, z]: [number, number, number]): VectorUtils {
    return new VectorUtils(x, y, z);
  }

  toVector3(): Vector3 {
    return { x: this.x, y: this.y, z: this.z };
  }

  toTuple(): [number, number, number] {
    return [this.x, this.y, this.z];
  }

  clone(): VectorUtils {
    return new VectorUtils(this.x, this.y, this.z);
  }

  // ──────────────────────────────────────────────────────────
  // Instance math ops
  // ──────────────────────────────────────────────────────────

  add(other: Vector3 | VectorUtils): VectorUtils {
    const v = VectorUtils._asVector3(other);
    return new VectorUtils(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  subtract(other: Vector3 | VectorUtils): VectorUtils {
    const v = VectorUtils._asVector3(other);
    return new VectorUtils(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  multiplyScalar(scalar: number): VectorUtils {
    return new VectorUtils(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  divideScalar(scalar: number): VectorUtils {
    if (scalar === 0) throw new Error("Cannot divide by zero");
    return new VectorUtils(this.x / scalar, this.y / scalar, this.z / scalar);
  }

  negate(): VectorUtils {
    return new VectorUtils(-this.x, -this.y, -this.z);
  }

  // ──────────────────────────────────────────────────────────
  // Instance vector properties
  // ──────────────────────────────────────────────────────────

  lengthSq(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  length(): number {
    return Math.sqrt(this.lengthSq());
  }

  normalize(): VectorUtils {
    const len = this.length();
    if (len === 0) return this.clone();
    return this.divideScalar(len);
  }

  dot(other: Vector3 | VectorUtils): number {
    const v = VectorUtils._asVector3(other);
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross(other: Vector3 | VectorUtils): VectorUtils {
    const v = VectorUtils._asVector3(other);
    return new VectorUtils(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }

  distanceSqTo(other: Vector3 | VectorUtils): number {
    const v = VectorUtils._asVector3(other);
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    const dz = this.z - v.z;
    return dx * dx + dy * dy + dz * dz;
  }

  distanceTo(other: Vector3 | VectorUtils): number {
    return Math.sqrt(this.distanceSqTo(other));
  }

  // ──────────────────────────────────────────────────────────
  // Instance interpolation / helpers
  // ──────────────────────────────────────────────────────────

  midpointTo(other: Vector3 | VectorUtils): VectorUtils {
    const v = VectorUtils._asVector3(other);
    return new VectorUtils(
      (this.x + v.x) / 2,
      (this.y + v.y) / 2,
      (this.z + v.z) / 2
    );
  }

  lerpTo(other: Vector3 | VectorUtils, t: number): VectorUtils {
    const v = VectorUtils._asVector3(other);
    const clamped = VectorUtils._clamp01(t);
    return new VectorUtils(
      this.x + (v.x - this.x) * clamped,
      this.y + (v.y - this.y) * clamped,
      this.z + (v.z - this.z) * clamped
    );
  }

  floor(): VectorUtils {
    return new VectorUtils(
      Math.floor(this.x),
      Math.floor(this.y),
      Math.floor(this.z)
    );
  }

  round(): VectorUtils {
    return new VectorUtils(
      Math.round(this.x),
      Math.round(this.y),
      Math.round(this.z)
    );
  }

  ceil(): VectorUtils {
    return new VectorUtils(
      Math.ceil(this.x),
      Math.ceil(this.y),
      Math.ceil(this.z)
    );
  }

  withX(x: number): VectorUtils {
    return new VectorUtils(x, this.y, this.z);
  }

  withY(y: number): VectorUtils {
    return new VectorUtils(this.x, y, this.z);
  }

  withZ(z: number): VectorUtils {
    return new VectorUtils(this.x, this.y, z);
  }

  // ──────────────────────────────────────────────────────────
  // Static utilities working on Vector3 / VectorUtils
  // ──────────────────────────────────────────────────────────

  /** Simple add of two vectors, returns a Minecraft Vector3. */
  static add(a: Vector3 | VectorUtils, b: Vector3 | VectorUtils): Vector3 {
    const va = this._asVector3(a);
    const vb = this._asVector3(b);
    return { x: va.x + vb.x, y: va.y + vb.y, z: va.z + vb.z };
  }

  static subtract(a: Vector3 | VectorUtils, b: Vector3 | VectorUtils): Vector3 {
    const va = this._asVector3(a);
    const vb = this._asVector3(b);
    return { x: va.x - vb.x, y: va.y - vb.y, z: va.z - vb.z };
  }

  static multiplyScalar(vec: Vector3 | VectorUtils, scalar: number): Vector3 {
    const v = this._asVector3(vec);
    return { x: v.x * scalar, y: v.y * scalar, z: v.z * scalar };
  }

  static divideScalar(vec: Vector3 | VectorUtils, scalar: number): Vector3 {
    if (scalar === 0) throw new Error("Cannot divide by zero");
    const v = this._asVector3(vec);
    return { x: v.x / scalar, y: v.y / scalar, z: v.z / scalar };
  }

  static distance(a: Vector3 | VectorUtils, b: Vector3 | VectorUtils): number {
    const va = this._asVector3(a);
    const vb = this._asVector3(b);
    const dx = va.x - vb.x;
    const dy = va.y - vb.y;
    const dz = va.z - vb.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  // ──────────────────────────────────────────────────────────
  // Centers / averages
  // ──────────────────────────────────────────────────────────

  /** Midpoint between two positions. */
  static midpoint(
    a: Vector3 | VectorUtils,
    b: Vector3 | VectorUtils
  ): Vector3 {
    const va = this._asVector3(a);
    const vb = this._asVector3(b);
    return {
      x: (va.x + vb.x) / 2,
      y: (va.y + vb.y) / 2,
      z: (va.z + vb.z) / 2,
    };
  }

  /**
   * Returns the input point with centered X and Z (floored + 0.5).
   */
  static center(point: Vector3 | VectorUtils): Vector3 {
    const v = this._asVector3(point);
    return {
      x: Math.floor(v.x) + 0.5,
      y: v.y,
      z: Math.floor(v.z) + 0.5,
    };
  }

  // ──────────────────────────────────────────────────────────
  // Interpolation / paths
  // ──────────────────────────────────────────────────────────

  /**
   * Linear interpolation between two vectors.
   * t is clamped to [0,1].
   */
  static lerp(
    a: Vector3 | VectorUtils,
    b: Vector3 | VectorUtils,
    t: number
  ): Vector3 {
    const va = this._asVector3(a);
    const vb = this._asVector3(b);
    const tt = this._clamp01(t);
    return {
      x: va.x + (vb.x - va.x) * tt,
      y: va.y + (vb.y - va.y) * tt,
      z: va.z + (vb.z - va.z) * tt,
    };
  }

  /**
   * Generates points between A and B spaced by a fixed distance `step`.
   *
   * Returns: [A, ..., B]
   *
   * - `step` is the desired spacing between each point.
   * - If `includeEnd` is false, B is not added at the end.
   */
  static pointsBetween(
    a: Vector3 | VectorUtils,
    b: Vector3 | VectorUtils,
    step: number,
    includeEnd: boolean = true
  ): Vector3[] {
    const va = this._asVector3(a);
    const vb = this._asVector3(b);

    const dx = vb.x - va.x;
    const dy = vb.y - va.y;
    const dz = vb.z - va.z;

    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    // Edge cases
    if (distance === 0 || step <= 0) {
      return includeEnd ? [va, vb] : [va];
    }

    const count = Math.floor(distance / step);
    const tStep = step / distance;

    const result: Vector3[] = [{ ...va }];
    for (let i = 1; i <= count; i++) {
      const t = tStep * i;
      result.push({
        x: va.x + dx * t,
        y: va.y + dy * t,
        z: va.z + dz * t,
      });
    }

    if (includeEnd) {
      result.push({ ...vb });
    }

    return result;
  }

  /**
   * Generates a fixed number of points between A and B (inclusive).
   *
   * For count=2 => [A, B]
   * For count=3 => [A, mid, B], etc.
   */
  static pointsBetweenByCount(
    a: Vector3 | VectorUtils,
    b: Vector3 | VectorUtils,
    count: number
  ): Vector3[] {
    const va = this._asVector3(a);
    const vb = this._asVector3(b);

    if (count <= 1) return [{ ...va }];
    const result: Vector3[] = [];

    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      result.push(this.lerp(va, vb, t));
    }

    return result;
  }

  /**
   * Given a path of points, interpolate along each segment with a fixed step distance.
   * Great for particles / pathfinding visuals.
   *
   * Returns an array including the first point, and the last point.
   */
  static interpolatePathByStep(
    path: (Vector3 | VectorUtils)[],
    step: number
  ): Vector3[] {
    if (path.length === 0) return [];
    if (path.length === 1) return [this._asVector3(path[0]!)];

    const result: Vector3[] = [];
    for (let i = 0; i < path.length - 1; i++) {
      const a = this._asVector3(path[i]!);
      const b = this._asVector3(path[i + 1]!);

      const segmentPoints = this.pointsBetween(
        a,
        b,
        step,
        /* includeEnd */ i === path.length - 2
      );

      if (i > 0 && segmentPoints.length > 0) {
        // Avoid duplicating joint point between segments
        segmentPoints.shift();
      }

      result.push(...segmentPoints);
    }

    return result;
  }

  /**
   * Given a path of points, generate a fixed number of points along the whole path.
   * This distributes points by segment length.
   */
  static interpolatePathByCount(
    path: (Vector3 | VectorUtils)[],
    totalPoints: number
  ): Vector3[] {
    if (path.length === 0) return [];
    if (path.length === 1 || totalPoints <= 1) {
      return [this._asVector3(path[0]!)];
    }

    const vectors = path.map((p) => this._asVector3(p));

    // Compute cumulative lengths
    const lengths: number[] = [0];
    let totalLength = 0;

    for (let i = 0; i < vectors.length - 1; i++) {
      const a = vectors[i];
      const b = vectors[i + 1];
      if (!a || !b) continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dz = b.z - a.z;
      const segLen = Math.sqrt(dx * dx + dy * dy + dz * dz);
      totalLength += segLen;
      lengths.push(totalLength);
    }

    if (totalLength === 0) {
      return [vectors[0]!];
    }

    const result: Vector3[] = [];
    for (let i = 0; i < totalPoints; i++) {
      const t = i / (totalPoints - 1);
      const targetDist = t * totalLength;

      // Find which segment this distance falls into
      let segIndex = 0;
      while (
        segIndex < lengths.length - 1 &&
        lengths[segIndex + 1] !== undefined &&
        targetDist > lengths[segIndex + 1]!
      ) {
        segIndex++;
      }

      const segStartDist = lengths[segIndex] ?? 0;
      const segEndDist = lengths[segIndex + 1] ?? 0;
      const localT =
        segEndDist === segStartDist
          ? 0
          : (targetDist - segStartDist) / (segEndDist - segStartDist);

      const a = vectors[segIndex]!;
      const b = vectors[segIndex + 1] ?? vectors[segIndex]!;
      result.push(this.lerp(a, b, localT));
    }

    return result;
  }

  // ──────────────────────────────────────────────────────────
  // Block helpers (optional but handy)
  // ──────────────────────────────────────────────────────────

  /** Floors x/y/z to block coordinates. */
  static toBlock(vec: Vector3 | VectorUtils): Vector3 {
    const v = this._asVector3(vec);
    return {
      x: Math.floor(v.x),
      y: Math.floor(v.y),
      z: Math.floor(v.z),
    };
  }

  /** Same as toBlock but returned as a VectorUtils instance. */
  static toBlockWrapped(vec: Vector3 | VectorUtils): VectorUtils {
    return VectorUtils.from(this.toBlock(vec));
  }

  // ──────────────────────────────────────────────────────────
  // Private helpers
  // ──────────────────────────────────────────────────────────

  private static _asVector3(input: Vector3 | VectorUtils): Vector3 {
    if (input instanceof VectorUtils) {
      return input.toVector3();
    }
    return input;
  }

  private static _clamp01(t: number): number {
    if (t < 0) return 0;
    if (t > 1) return 1;
    return t;
  }
}

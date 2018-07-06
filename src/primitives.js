export const radarBuilding = { 
  id: 'radar-building',
  create: function() {

    const group = this.ctx.createGroup()
      .setPosition({ x: 0, y: 40 })

    this.building = this.ctx.createRectangle()
      .setWidth(40)
      .setHeight(20)
    group.addChild(this.building);

    this.dish = this.ctx.createTriangle()
      .setPosition({ x: 30, y: -20 })
      .setWidth(30)
      .setHeight(30)
      .setVertices({
        vertex1: { x: 0, y: 0 },
        vertex2: { x: 1, y: 1 },
        vertex3: { x: 0.3, y: 0.7 },
      })
    group.addChild(this.dish);

    return group;
  },
  render: function({ state }) {
    this.setVisible(state.hasRadar);
    this.building.setStrokeColor(state.color);
    this.dish.setStrokeColor(state.color);
  }
};

export const planet = {
  id: 'planet',
  create: function() {
    const planet = this.ctx.createGroup()
    const circle = this.ctx.createCircle()
      .setRadius(100)
    planet.addChild(circle);

    this.teamIndicator = this.ctx.createRectangle()
      .setWidth(10)
      .setHeight(10)
      .setPosition({ x: -5, y: -5 })
    planet.addChild(this.teamIndicator);

    this.centerBuilding = this.ctx.createRectangle()
      .setWidth(40)
      .setHeight(40)
      .setPosition({ x: -20, y: -20 })
      .setFillColor('none')
    planet.addChild(this.centerBuilding);

    this.leftBuilding = this.ctx.createRectangle()
      .setWidth(40)
      .setHeight(80)
      .setPosition({ x: -70, y: -40 })
    planet.addChild(this.leftBuilding);

    this.topBuilding = this.ctx.createRectangle()
      .setWidth(45)
      .setHeight(30)
      .setPosition({ x: 0, y: -70 })
    planet.addChild(this.topBuilding)

    this.radar = this.ctx.createPrimitive({
      primitiveId: 'radar-building' });
    planet.addChild(this.radar);
    return planet;
  },
  render: function({ state }) {

    if (state.showBuilding) {
      this.leftBuilding.setVisible(true);
    }

    this.teamIndicator.setStrokeColor(state.color);
    this.teamIndicator.setFillColor(state.color);
    this.centerBuilding.setStrokeColor(state.color);
    this.leftBuilding.setStrokeColor(state.color);
    this.topBuilding.setStrokeColor(state.color);

    this.radar.render({ state });

    //planet.getChildById('radar');
  }
};
